import logoMB from "../assets/logobank/logo-MBbank.png"
import logoAri from "../assets/logobank/logo-aribank.png"
import logoVietCom from "../assets/logobank/logo-vietcombank.png"
import logoVieTin from "../assets/logobank/logo-viettinbank.png"
import logoBIDV from "../assets/logobank/logo-bidv.png"
import banner1 from "../assets/banner/banner4.jpg"
import banner2 from "../assets/banner/banner5.jpg"
import banner3 from "../assets/banner/banner3.jpg"
import banner4 from "../assets/banner/banner1.jpg"
import banner5 from "../assets/banner/banner2.jpg"
import data from "../assets/shopping/napdata.png"
import napgame from "../assets/shopping/thenapgame.png"
import amthuc from "../assets/shopping/veamthuc.png"
import benhvien from "../assets/shopping/vebenhvien.jpg"
import dulich from "../assets/shopping/vedulich.jpg"
import khachsan from "../assets/shopping/vekhachsan.jpg"
import maybay from "../assets/shopping/vemaybay.jpg"
import shoping from "../assets/shopping/veshoping.jpg"
import veso from "../assets/shopping/veso.jpg"
import vuichoi from "../assets/shopping/vevuichoi.png"
import xekhach from "../assets/shopping/vexekhach.png"
import xemphim from "../assets/shopping/vexemphim.jpg"
import iconbienlai from "../assets/icons/iconbienlai.jpg"
import iconimage from "../assets/icons/iconimage.png"
import iconshare from "../assets/icons/iconshare.png"


export const banks = [
    { id: "1", name: "Vietcombank" },
    { id: "3", name: "BIDV" },
    { id: "6", name: "VietinBank" },
    { id: "4", name: "Agribank" },
    { id: "2", name: "Techcombank" },
    { id: "5", name: "MB Bank" },
    { id: "15", name: "Sacombank" },
    { id: "8", name: "ACB" },
    { id: "13", name: "TPBank" },
    { id: "10", name: "HDBank" },
    { id: "11", name: "VIB" },
    { id: "9", name: "SHB" },
    { id: "12", name: "SeABank" },
    { id: "14", name: "OCB" },
    { id: "16", name: "Eximbank" },
    { id: "17", name: "SCB" },
    { id: "18", name: "Nam A Bank" },
    { id: "19", name: "NCB" },
];


export const recentRecipients = [
    { id: "1", name: "Nguyễn văn A", bankLogo: logoMB },
    { id: "2", name: "Trần văn B", bankLogo: logoAri },
    { id: "3", name: "Phạm văn C", bankLogo: logoVietCom },
    { id: "4", name: "Nguyễn văn A", bankLogo: logoBIDV },
    { id: "5", name: "Trần văn B", bankLogo: logoVieTin },
    { id: "6", name: "Phạm thi van thi C", bankLogo: logoMB },
    { id: "7", name: "Nguyễn A", bankLogo: logoAri },
    { id: "8", name: "Trần B", bankLogo: logoVietCom },
    { id: "9", name: "Phạm C", bankLogo: logoBIDV },
];

export const savedRecipients = [
    { id: "1", name: "Nguyễn Văn A", accountNumber: "0123456789", bankName: "Vietcombank", bankLogo: logoVieTin },
    { id: "2", name: "Trần Văn B", accountNumber: "9876543210", bankName: "Techcombank", bankLogo: logoBIDV },
    { id: "3", name: "Nguyễn Văn A", accountNumber: "0123456789", bankName: "Vietcombank", bankLogo: logoVietCom },
    { id: "4", name: "Trần Văn B", accountNumber: "9876543210", bankName: "Techcombank", bankLogo: logoAri },
    { id: "5", name: "Nguyễn A", accountNumber: "0123456789", bankName: "Vietcombank", bankLogo: logoVieTin },
    { id: "6", name: "Trần B", accountNumber: "9876543210", bankName: "Techcombank", bankLogo: logoMB },
    { id: "7", name: "Nguyễn A", accountNumber: "0123456789", bankName: "Vietcombank", bankLogo: logoBIDV },
    { id: "8", name: "Trần B", accountNumber: "9876543210", bankName: "Techcombank", bankLogo: logoMB },

];


export const sliderImages = [
    banner1, banner2, banner3, banner4, banner5
];

export const icon = { iconbienlai: iconbienlai, iconimage: iconimage, iconshare: iconshare }



export const featureIteam = [

    { id: 1, title: "Chuyển tiền", iconName: "swap-horizontal-outline" },
    { id: 2, title: "Nạp tiền điện thoại", iconName: "phone-portrait-outline" },
    { id: 3, title: "Tiền gửi", iconName: "wallet-outline" },
    { id: 4, title: "Vay nhanh", iconName: "cash-outline" },
    { id: 5, title: "Thanh toán", iconName: "card-outline" },
    { id: 6, title: "Rút tiền", iconName: "arrow-down-circle-outline" },
    { id: 7, title: "Internet", iconName: "globe-outline" },
    { id: 8, title: "Bảo hiểm", iconName: "shield-checkmark-outline" },
]


export const shoppingItems = [
    { image: shoping, label: "Shop Online" },
    { image: napgame, label: "Nạp game" },
    { image: amthuc, label: "Đồ Ăn" },
    { image: xekhach, label: "Đặt xe" },
    { image: veso, label: "Vé số" },
    { image: data, label: "Data 4G" },
    { image: maybay, label: "Vé máy bay" },
    { image: benhvien, label: "Sức Khỏe" },
    { image: dulich, label: "Du lịch" },
    { image: khachsan, label: "Khách sạn" },
    { image: vuichoi, label: "Vui chơi" },
    { image: xemphim, label: "Xem phim" },
];




export const bankLogos: { [key: string]: any } = {
    "Vietcombank": require("../assets/logobank/logo-vietcombank.png"),
    "Techcombank": require("../assets/logobank/logo-techcombank.png"),
    "BIDV": require("../assets/logobank/logo-bidv.png"),
    "Agribank": require("../assets/logobank/logo-aribank.png"),
    "MB Bank": require("../assets/logobank/logo-MBbank.png"),
    "VietinBank": require("../assets/logobank/logo-viettinbank.png"),
    "ACB": require("../assets/logobank/logo-acb.png"),
    "SHB": require("../assets/logobank/logo-shb.png"),
    "HDBank": require("../assets/logobank/logo-hdbank.png"),
    "VIB": require("../assets/logobank/logo-vib.png"),
    "SeABank": require("../assets/logobank/logo-seabank.jpg"),
    "TPBank": require("../assets/logobank/logo-TP.jpg"),
    "OCB": require("../assets/logobank/logo-ocb.png"),
    "Sacombank": require("../assets/logobank/logo-sacombank.jpg"),
    "Eximbank": require("../assets/logobank/logo-eximbank.jpg"),
    "SCB": require("../assets/logobank/logo-vietcombank.png"),
    "Nam A Bank": require("../assets/logobank/logo-namabank.jpg"),
    "NCB": require("../assets/logobank/logo-ncb.jpg"),
};

