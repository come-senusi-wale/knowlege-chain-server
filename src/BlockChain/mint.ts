import { ethers } from 'ethers'
import { nftTokenAbi } from "./nftToken.abi";
import dotenv from 'dotenv'
dotenv.config()

const provider = new ethers.JsonRpcProvider(process.env.PROVIDER_URL);
const signer = new ethers.Wallet(process.env.ADMIN_WALLET_PRIVATEKEY!, provider);
const contract = new ethers.Contract(process.env.NFT_TOKEN_CONTRACT_ADDRESS!, nftTokenAbi, provider) as any;

export const mint = async (walletAddress: any) => {
    try {
        console.log(1)

        const tx = await contract.connect(signer).mintOption(walletAddress);

        console.log(2)

        console.log("Transaction sent:", tx.hash);

        const receipt = await tx.wait();
        console.log(3)
        console.log("Transaction mined:", receipt);
        console.log(4)

        return {
            status: true,
            data: receipt
        }
        
    } catch (error) {
        console.log('error', error)
        return {
            status: false,
            message: "Unable to perform mint transaction"
        }
    }
}