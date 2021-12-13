import { makeAutoObservable } from 'mobx';

import {
    SET_TOKEN,
    SET_CONNECTION,
    SET_USER_ID,
    SET_USER_AVATAR,
    SET_USER_TEMP_AVATAR,
    SET_USER_FULL_NAME,
    SET_USER_EMAIL,
    SET_USER_AUTHORITY,
    SET_USER_DEVICE_BRAND,
    SET_USER_DEVICE_MODEL,
    SET_USER_DEVICE_OS_VERSION,
    SET_SETTINGS_APP_NAME,
    SET_SETTINGS_APP_VERSION,
    SET_SETTINGS_ASSETS_URL,
    SET_SETTINGS_SHARE_APP_TEXT,
    SET_SETTINGS_DOWNLOAD_URL,
    SET_SETTINGS_DOWNLOAD_REF_URL,
    SET_SETTINGS_SHARE_TEXT,
    SET_SETTINGS_PASSWORD_RESET_URL,
    SET_SETTINGS_USER_ACCOUNT_URL,
    SET_SETTINGS_HELP_URL,
    SET_SETTINGS_USERAGENT,
} from './types';

class Store {
    token = null;
    connection = null;
    user = {
        id: null,
        avatar: null,
        temp_avatar: null,
        full_name: null,
        email: null,
        authority: null,
        device_brand: null,
        device_model: null,
        device_os_version: null,
    };
    settings = {
        app_name: null,
        app_version: null,
        assets_url: null,
        share_app_text: null,
        download_url: null,
        download_ref_url: null,
        share_text: null,
        password_reset_url: null,
        user_account_url: null,
        help_url: null,
        useragent: null,
    };

    constructor() {
        makeAutoObservable(this);
    }

    setStore(key, value) {
        switch (key) {
            case SET_TOKEN:
                if (value === null || typeof value === 'undefined') {
                    this.token = '';
                    return;
                }
                this.token = value;
                break;

            case SET_CONNECTION:
                this.connection = value;
                break;

            case SET_USER_ID:
                this.user.id = value;
                break;
            case SET_USER_AVATAR:
                this.user.avatar = value;
                break;
            case SET_USER_TEMP_AVATAR:
                this.user.temp_avatar = value;
                break;
            case SET_USER_FULL_NAME:
                this.user.full_name = value;
                break;
            case SET_USER_EMAIL:
                this.user.email = value;
                break;
            case SET_USER_AUTHORITY:
                this.user.authority = value;
                break;
            case SET_USER_DEVICE_BRAND:
                this.user.device_brand = value;
                break;
            case SET_USER_DEVICE_MODEL:
                this.user.device_model = value;
                break;
            case SET_USER_DEVICE_OS_VERSION:
                this.user.device_os_version = value;
                break;

            case SET_SETTINGS_APP_NAME:
                this.settings.app_name = value;
                break;
            case SET_SETTINGS_APP_VERSION:
                this.settings.app_version = value;
                break;
            case SET_SETTINGS_ASSETS_URL:
                this.settings.assets_url = value;
                break;
            case SET_SETTINGS_SHARE_APP_TEXT:
                this.settings.share_app_text = value;
                break;
            case SET_SETTINGS_DOWNLOAD_URL:
                this.settings.download_url = value;
                break;
            case SET_SETTINGS_DOWNLOAD_REF_URL:
                this.settings.download_ref_url = value;
                break;
            case SET_SETTINGS_SHARE_TEXT:
                this.settings.share_text = value;
                break;
            case SET_SETTINGS_PASSWORD_RESET_URL:
                this.settings.password_reset_url = value;
                break;
            case SET_SETTINGS_USER_ACCOUNT_URL:
                this.settings.user_account_url = value;
                break;
            case SET_SETTINGS_HELP_URL:
                this.settings.help_url = value;
                break;
            case SET_SETTINGS_USERAGENT:
                this.settings.useragent = value;
                break;
            default:
                break;
        }
    }
}

export const store = new Store();
