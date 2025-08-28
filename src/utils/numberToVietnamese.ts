const numberToVietnamese = (n: number): string => {
    if (n === 0) return "Không đồng";

    const nums = ["không", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"];
    const units = ["", "nghìn", "triệu", "tỷ"];

    // Tách số thành các nhóm 3 chữ số
    const splitNumber = (num: number) => {
        const strNum = num.toString();
        const groups: string[] = [];
        let i = strNum.length;
        while (i > 0) {
            const start = Math.max(i - 3, 0);
            groups.unshift(strNum.slice(start, i));
            i -= 3;
        }
        return groups;
    };

    // Đọc một nhóm 3 chữ số
    const readThreeDigits = (numStr: string, isFirstGroup: boolean) => {
        let result = "";
        while (numStr.length < 3) numStr = "0" + numStr; // Bổ sung số 0 ở đầu nếu thiếu
        const [hundreds, tens, ones] = numStr.split("").map(Number);

        // Hàng trăm
        if (hundreds !== 0) {
            result += nums[hundreds] + " trăm";
        } else if (!isFirstGroup && (tens !== 0 || ones !== 0)) {
            result += "không trăm";
        }

        // Hàng chục
        if (tens !== 0) {
            result += " " + (tens === 1 ? "mười" : nums[tens] + " mươi");
        } else if (tens === 0 && ones !== 0 && (!isFirstGroup || hundreds !== 0)) {
            // Chỉ thêm "lẻ" khi KHÔNG phải nhóm đầu tiên hoặc nhóm đầu tiên có hàng trăm
            result += " lẻ";
        }

        // Hàng đơn vị
        if (ones !== 0) {
            let readOne = "";
            if (tens === 0 || tens === 1) {
                readOne = ones === 5 ? "năm" : nums[ones];
            } else {
                if (ones === 1) readOne = "mốt";
                else if (ones === 4) readOne = "tư";
                else if (ones === 5) readOne = "lăm";
                else readOne = nums[ones];
            }
            result += " " + readOne;
        }

        return result.trim();
    };

    const groups = splitNumber(n);
    let result = "";
    let unitIndex = groups.length - 1;

    for (let i = 0; i < groups.length; i++) {
        const num = Number(groups[i]);
        if (num !== 0) {
            result += readThreeDigits(groups[i], i === 0) + " " + units[unitIndex] + " ";
        } else {
            // Nếu nhóm là 0 nhưng đơn vị là tỷ (ở giữa) thì vẫn giữ từ "tỷ"
            if (unitIndex === 3) result += units[unitIndex] + " ";
        }
        unitIndex--;
    }

    result = result.replace(/\s+/g, " ").trim();
    result = result.charAt(0).toUpperCase() + result.slice(1) + " đồng";

    return result;
};

export default numberToVietnamese;
