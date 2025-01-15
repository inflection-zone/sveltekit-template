import { SYSTEM_ID } from "$lib/constants";
import { AHA_PUBLIC_FOOTER_LINK, AHA_PUBLIC_FOOTER_TEXT, AHA_PUBLIC_LOGO_IMAGE_SOURCE, AHA_SYSTEM_NAME, REAN_PUBLIC_FOOTER_LINK, REAN_PUBLIC_FOOTER_TEXT, REAN_PUBLIC_LOGO_IMAGE_SOURCE, REAN_SYSTEM_NAME, SystemTypes } from "$lib/system.types";

//////////////////////////////////////////////////////////////////////////////

export const getPublicLogoImageSource = () => {
    const systemType: SystemTypes = SYSTEM_ID as SystemTypes;
    switch (systemType as SystemTypes) {
        case SystemTypes.REAN:
            return REAN_PUBLIC_LOGO_IMAGE_SOURCE;
        case SystemTypes.AHA:
            return AHA_PUBLIC_LOGO_IMAGE_SOURCE;
        default:
            return REAN_PUBLIC_LOGO_IMAGE_SOURCE;
    }
};

export const getPublicFooterText = () => {
    const systemType: SystemTypes = SYSTEM_ID as SystemTypes;
    switch (systemType as SystemTypes) {
        case SystemTypes.REAN:
            return REAN_PUBLIC_FOOTER_TEXT;
        case SystemTypes.AHA:
            return AHA_PUBLIC_FOOTER_TEXT;
        default:
            return REAN_PUBLIC_FOOTER_TEXT;
    }
};

export const getPublicFooterLink = () => {
    const systemType: SystemTypes = SYSTEM_ID as SystemTypes;
    switch (systemType as SystemTypes) {
        case SystemTypes.REAN:
            return REAN_PUBLIC_FOOTER_LINK;
        case SystemTypes.AHA:
            return AHA_PUBLIC_FOOTER_LINK;;
        default:
            return REAN_PUBLIC_FOOTER_LINK;
    }
};

export const getSystemName = () => {
    const systemType: SystemTypes = SYSTEM_ID as SystemTypes;
    switch (systemType as SystemTypes) {
        case SystemTypes.REAN:
            return REAN_SYSTEM_NAME;
        case SystemTypes.AHA:
            return AHA_SYSTEM_NAME;
        default:
            return REAN_SYSTEM_NAME;
    }
};
