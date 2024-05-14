// Menu mode
export const MODE = {
    HOME: 0, ABOUT: 1, BLOG: 2, PRODUCTION: 3, BOARD: 4, UPDATES: 5, TUTORIAL: 6,
};

export const LINK = {
    "TWITTER": "https://twitter.com/zenryoku_kun0",
    "INSTAGRAM": "https://z-p42.www.instagram.com/zen_ryoku_kun/",
    "GITHUB": "https://github.com/zenryokukun",
    // "MAP": "https://www.google.co.jp/maps/place/%E5%AF%8C%E5%A3%AB%E5%B1%B1/@35.3669817,138.7807581,11.38z/data=!4m5!3m4!1s0x6019629a42fdc899:0xa6a1fcc916f3a4df!8m2!3d35.3606361!4d138.7272835?hl=ja",
    "MAIL": "zenryokukun@gmail.com",
    "TWITTER2": "https://twitter.com/botterdevjp",
}

// font-awesome styles,and links.
export const ICON = {
    "TWITTER": {
        STYLE: "fa-brands fa-twitter fa-2x",
        LINK: LINK.TWITTER,
        LABEL: "Go to my Twitter timeline."
    },
    "INSTAGRAM": {
        STYLE: "fa-brands fa-instagram fa-2x",
        LINK: LINK.INSTAGRAM,
        LABEL: "Go to my Instagram."
    },

    "GITHUB": {
        STYLE: "fa-brands fa-github fa-2x",
        LINK: LINK.GITHUB,
        LABEL: "Go to my Github page."
    },

    // "MAP": {
    //     STYLE: "fa-solid fa-location-dot fa-1x",
    //     LINK: LINK.MAP,
    //     LABEL: "Show where I am located!"
    // },

    // "BACK": {
    //     STYLE: "fa-solid fa-circle-left fa-3x",
    //     LINK: "!#",
    //     LABEL: "Go to previous page."
    // },

    "MAIL": {
        STYLE: "fa-solid fa-envelope",
        LINK: LINK.MAIL,
        LABEL: "Email me."
    },

    "TWITTER2": {
        STYLE: "fa-brands fa-twitter fa-2x",
        LINK: LINK.TWITTER2,
        LABEL: "Go to my second Twitter timeline."
    },

};

// url内のディレクトリ文字列。変わる可能性あるので変数に。
export const URL_DIR = {
    MD: "post",
    MDX: "new-post",
    TUTORIAL: "tutorial",
}
