import styled from "styled-components";
import Logo from "./Logo.jsx";
import MainNav from "./MainNav.jsx";
import { lazy, Suspense } from "react";

const SampleDataUploader = import.meta.env.DEV
  ? lazy(() => import("../data/Uploader.jsx"))
  : null;

const StyledSidebar = styled.aside`
  padding: 3.2rem 2.4rem;
  border-right: 1px solid var(--color-grey-100);
  grid-row: 1 / -1;
  background-color: var(--color-grey-0);
  display: flex;
  flex-direction: column;
  gap: 3.2rem;
`;

function Siderbar() {
  return (
    <StyledSidebar>
      <Logo />
      <MainNav />
      {SampleDataUploader && <Suspense fallback={null}><SampleDataUploader /></Suspense>}
    </StyledSidebar>
  );
}

export default Siderbar;
