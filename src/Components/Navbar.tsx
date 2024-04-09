import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";

const Navbar = () => {
  return (
    <div>
        <WalletSelector />
    </div>
  )
}

export default Navbar;