import { beforeEach, describe, expect, it, vi } from "vitest";
import { createCabin } from "./apiCabins";

const mocks = vi.hoisted(() => ({
  from: vi.fn(), upload: vi.fn(), remove: vi.fn(), storageFrom: vi.fn(),
}));
vi.mock("./supabase.js", () => ({
  supabaseUrl: "https://test.supabase.co",
  default: { from: mocks.from, storage: { from: mocks.storageFrom } },
}));

const file = { name: "cabin.jpg" };

beforeEach(() => {
  vi.resetAllMocks();
  mocks.storageFrom.mockReturnValue({ upload: mocks.upload, remove: mocks.remove });
  mocks.upload.mockResolvedValue({ error: null });
  mocks.remove.mockResolvedValue({ error: null });
});

describe("cabin image failures", () => {
  it("keeps an existing cabin untouched when a replacement upload fails", async () => {
    mocks.upload.mockResolvedValue({ error: new Error("Storage unavailable") });
    await expect(createCabin({ name: "001", image: file }, 42)).rejects.toThrow("could not be uploaded");
    expect(mocks.from).not.toHaveBeenCalled();
  });

  it("cleans up a new image if saving the cabin fails without deleting the cabin", async () => {
    const query = {
      update: vi.fn().mockReturnThis(), eq: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: new Error("Database unavailable") }),
    };
    mocks.from.mockReturnValue(query);
    await expect(createCabin({ name: "001", image: file }, 42)).rejects.toThrow("failed to create");
    expect(mocks.remove).toHaveBeenCalledWith([expect.stringContaining("cabin.jpg")]);
    expect(query.update).toHaveBeenCalled();
  });

  it("reuses an existing image when duplicating a cabin", async () => {
    const cabin = { name: "Copy of 001", image: "https://test.supabase.co/storage/v1/object/public/cabin-images/001.jpg" };
    const query = {
      insert: vi.fn().mockReturnThis(), select: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: { ...cabin, id: 43 }, error: null }),
    };
    mocks.from.mockReturnValue(query);
    expect(await createCabin(cabin)).toEqual({ ...cabin, id: 43 });
    expect(mocks.upload).not.toHaveBeenCalled();
    expect(mocks.remove).not.toHaveBeenCalled();
  });
});
