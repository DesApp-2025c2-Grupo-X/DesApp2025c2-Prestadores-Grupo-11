import Layout from "./Layout";
import { SidebarProvider } from "../context/SidebarContext";
import SideBar from "./SideBar";
import HeaderPrestadores from "./HeaderPrestadores";
import "./PrestadoresLayout.css";

export default function PrestadoresLayout({ children }) {
  return (
    <SidebarProvider>
      <Layout header={<HeaderPrestadores />}>
        <div className="prestadores-layout d-flex">
          <SideBar />
          <main className="prestadores-content flex-grow-1">{children}</main>
        </div>
      </Layout>
    </SidebarProvider>
  );
}
