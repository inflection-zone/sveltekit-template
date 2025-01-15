import { DateStringFormat } from "./time.types";

export class Helper {

    static isEmail = (str: string): boolean => {

        const emailRegex = /^[-!#$%&'*+/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
        if (!str)
            return false;

        if (str.length > 254)
            return false;

        const valid = emailRegex.test(str);
        if (!valid)
            return false;

        const parts = str.split("@");
        if (parts[0].length > 64)
            return false;

        const domainParts = parts[1].split(".");
        if (domainParts.some(function (part) { return part.length > 63; }))
            return false;

        return true;
    };

    static truncateText = (text, numChars) => {
		const txt = text.length > numChars ? text.substring(0, numChars-3) + '...': text;
        return txt;
	}

    static hasProperty = (obj, prop) => {
        return Object.prototype.hasOwnProperty.call(obj, prop);
    };

    static isEmpty = (obj) => {
        return Object.keys(obj).length === 0 && obj.constructor === Object;
    };

    static isOtp = (str: string): boolean => {
        if (str.length < 4 || str.length > 6) {
            return false;
        }
        for (let i = 0; i < str.length; i++) {
            const c = str[i];
            if (Helper.isDigit(c)) {
                continue;
            }
            else {
                return false;
            }
        }
        return true;
    };

    static isUrl = (str) => {
        if (!str) {
            return false;
        }
        try {
            new URL(str);
            return true;
        } catch (err) {
            return false;
        }
    };

    static formatDate = (date) => {
        const d = new Date(date);
        const month = ('00' + (d.getMonth() + 1).toString()).slice(-2);
        const day = ('00' + d.getDate().toString()).slice(-2);
        const year = d.getFullYear();
        return [year, month, day].join('-');
    };

    static isPhone = (str: string): boolean => {
        if (!str) {
            return false;
        }
        if (str.length < 6 || str.length > 11) {
            return false;
        }
        for (let i = 0; i < str.length; i++) {
            const c = str[i];
            if (Helper.isDigit(c) || c === '-') {
                continue;
            }
            else {
                return false;
            }
        }
        return true;
    };

    static sanitizePhone = (phone: string): string => {
        if (!phone) {
            return phone;
        }
        if (phone.startsWith('1000001') || phone.startsWith('1000002')) {
            //Internal test phone numbers
            return phone;
        }
        const prefix = '+91-';
        if (!phone.startsWith(prefix)) {
           return prefix + phone
        }
        return phone;
    }

    static createResponse = (action: 'message' | 'redirect' | 'error' | 'data', content: string) => {
        return new Response(JSON.stringify({
			action: action,
			content: content
		}))
    };

    static toBase64 =  async (file): Promise<string | ArrayBuffer> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    };

    static dataURLtoBlob = (dataurl) => {
        const arr = dataurl.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);

        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], {type:mime});
    };

    static downloadAsInlineObjectUrl = (response) => {
        return Helper.dataURLtoBlob(response.Data.Buffer);
    };

    static getFileExtensionFromMimeType = (mimeType) => {
        const parts = mimeType.split('/');
        return parts.pop();
    };

    static b64toBlob = async (base64Buffer, mimeType) => {
        const res = await fetch(`data:${mimeType};base64,${base64Buffer}`);
        const blob = await res.blob();
        return blob;
    };

    static getAndValidatePhoneWithCountryCode = (phone: string) => {
        if (!phone) {
            return null;
        }

        if (!phone.includes('-')) {
            return null;
        }

        phone = phone.trim();
        const countryCode = phone.split('-')[0].trim();
        const phoneNumber = phone.split('-')[1].trim();;

        if (countryCode.length > 0 && phoneNumber.length === 10) {
            let isPhoneValid: boolean = true;
            for (let i = 0; i < phoneNumber.length; i++) {
                const c = phoneNumber[i];
                if (Helper.isDigit(c)) {
                    continue;
                }
                else {
                    isPhoneValid = false;
                    break;
                }
            }

            let isCountryCodeValid: boolean = true;
            for (let i = 0; i < countryCode.length; i++) {
                const c = countryCode[i];
                if (Helper.isDigit(c)) {
                    continue;
                }
                else {
                    isCountryCodeValid = false;
                    break;
                }
            }

            if (isCountryCodeValid && isPhoneValid) {
                return `${countryCode}-${phoneNumber}`;
            }
        }
        return null;
    }

    static addHours = (numOfHours: number, date = new Date()): Date => {
        date.setTime(date.getTime() + numOfHours * 60 * 60 * 1000);
        return date;
    }

    static getDateString = (date: Date, format: DateStringFormat): string => {

        if (format === DateStringFormat.YYYY_MM_DD) {
            return date.toISOString().split('T')[0];
        }
        return date.toISOString().split('T')[0];
    };

    static getYesterdayDate = (): string => {
        const today = new Date();
        today.setDate(today.getDate() - 1);
        return Helper.getDateString(today, DateStringFormat.YYYY_MM_DD);
    };
}
