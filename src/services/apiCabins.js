import supabase, { supabaseUrl } from "./supabase.js";

export async function getCabins() {
  const { data, error } = await supabase.from("cabins").select("*");

  if (error) {
    console.log("Cabins failed to fetch");
    throw new Error("Cabins failed to fetch");
  }
  return data;
}

export async function createCabin(cabin, id) {
  const hasImagePath = cabin.image?.startsWith?.(supabaseUrl);
  const imageName = hasImagePath
    ? null
    : `${crypto.randomUUID()}-${cabin.image.name}`.replaceAll("/", "");
  const imagePath = hasImagePath
    ? cabin.image
    : `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;
  // Upload first so a storage failure cannot delete an existing cabin during editing.
  if (!hasImagePath) {
    const { error: storageError } = await supabase.storage
      .from("cabin-images")
      .upload(imageName, cabin.image);
    if (storageError) throw new Error("Cabin image could not be uploaded");
  }

  //CREATE/EDIT CABIN
  let query = supabase.from("cabins");
  //CREATE CABIN
  if (!id) {
    query = query.insert([{ ...cabin, image: imagePath }]);
  }
  //EDIT CABIN
  if (id) {
    query = query.update({ ...cabin, image: imagePath }).eq("id", id);
  }
  const { data, error } = await query.select().single();

  if (error) {
    if (!hasImagePath)
      await supabase.storage.from("cabin-images").remove([imageName]);
    console.log("Cabins failed to create");
    throw new Error("Cabins failed to create");
  }
  return data;
}

export async function deleteCabin(id) {
  const { error } = await supabase.from("cabins").delete().eq("id", id);

  if (error) {
    console.log("Cabins failed to delete");
    throw new Error("Cabins failed to delete");
  }
}
