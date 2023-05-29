/**
 * md-convererページで使用
 * 変換したhtml文字列から、ダウンロード用htmlファイルを生成する
 * styleもベタ打ちで設定しているため、今後テーマの切替が可能になったら変更の必要あり。
 */

/**
 * 
 * @param article MDをhtmlに変換した文字列
 */
export default function genDocString(article: string) {
    const docstring = `
<!DOCTYPE html>
<head>
<meta charset="utf-8">
<meta httpEquiv="X-UA-Compatible" content="IE=edge" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<style>
    code[class*="language-"],
    pre[class*="language-"] {
        color: #ccc;
        background: none;
        font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
        font-size: 1em;
        text-align: left;
        white-space: pre;
        word-spacing: normal;
        word-break: normal;
        word-wrap: normal;
        line-height: 1.5;
        -moz-tab-size: 4;
        -o-tab-size: 4;
        tab-size: 4;
        -webkit-hyphens: none;
        -ms-hyphens: none;
        hyphens: none;
    }
    /* Code blocks */
    pre[class*="language-"] {
        padding: 1em;
        margin: .5em 0;
        overflow: auto;
    }
    :not(pre) > code[class*="language-"],
    pre[class*="language-"] {
        background: #2d2d2d;
    }
    /* Inline code */
    :not(pre) > code[class*="language-"] {
        padding: .1em;
        border-radius: .3em;
        white-space: normal;
    }
    .token.comment,
    .token.block-comment,
    .token.prolog,
    .token.doctype,
    .token.cdata {
        color: #999;
    }
    .token.punctuation {
        color: #ccc;
    }
    .token.tag,
    .token.attr-name,
    .token.namespace,
    .token.deleted {
        color: #e2777a;
    }
    .token.function-name {
        color: #6196cc;
    }
    .token.boolean,
    .token.number,
    .token.function {
        color: #f08d49;
    }
    .token.property,
    .token.class-name,
    .token.constant,
    .token.symbol {
        color: #f8c555;
    }
    .token.selector,
    .token.important,
    .token.atrule,
    .token.keyword,
    .token.builtin {
        color: #cc99cd;
    }
    .token.string,
    .token.char,
    .token.attr-value,
    .token.regex,
    .token.variable {
        color: #7ec699;
    }
    .token.operator,
    .token.entity,
    .token.url {
        color: #67cdcc;
    }
    .token.important,
    .token.bold {
        font-weight: bold;
    }
    .token.italic {
        font-style: italic;
    }
    .token.entity {
        cursor: help;
    }
    .token.inserted {
        color: green;
    }
</style>
<style>
    * {
        box-sizing: border-box;
    }
    main {
        display: flex;
        flex-direction: column;
        /* justify-content: center; */
        align-items: center;
        min-height: 80vh
    }

    article nav {
        background-color: #f9f5f5;
        box-shadow: 0 2px 5px 0 rgba(0, 0, 0, .16), 0 2px 10px 0 rgba(0, 0, 0, .12);
        margin-top: 1rem;
        margin-bottom: 1rem;
        padding-left: 1rem;
        width: 80%;
    }
    
    article>p>code,
    
    article>code {
        font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
        background-color: #e1e1e1;
    }
    
    article>blockquote {
        margin: 0;
    }
    
    article>* {
        width: 100%;
    }
    
    article>h1 {
        border-left: solid 5px #E91E63;
        background-color: #f7f7f7;
        padding-left: 1rem;
        text-align: center;
    }
    
    article>h2 {
        border-left: solid 5px #E91E63;
        background-color: #fcfcfc;
        padding-left: 1rem;
    }
    
    article>ul {
        margin-block-start: 0px;
        margin-block-end: 0px;
        margin-inline-start: 0px;
        margin-inline-end: 0px;
        padding-inline-start: 20px;
    }
    
    article>ul:last-child {
        margin-bottom: 1rem;
    }
    
    article>p>img {
        display: block;
        margin: 0 auto;
        max-width: 100%;
    }
    
    article>blockquote>p {
        padding: 0.3rem;
        background-color: #eaeaea;
        font-style: italic;
    }
    
    article>nav {
        margin: auto;
        padding-top: 1rem;
        padding-bottom: 1rem;
    }
    article {
        width:60%;
    }
    @media screen and (max-width:1024px) {
        article {
            width: 80%;
        }
        article nav {
            width: 100%;
        }
    }
    @media screen and (max-width:650px) {
        article>p>video {
          width: 100%;
          height: auto;
        }
      }
    @media screen and (max-width:600px) {
        article {
            width:95%;
        }
        body {
            font-size: 0.9rem;
        }
    }
    /*
    @media screen and (min-width:601px) {
        article a {
            scroll-margin-top: 4rem;
        }
    }
    */
    @media (prefers-color-scheme:dark) {
        article {
            color: #e0e0e0;
        }
        
        article>h1 {
            background-color: #383838;
        }
        
        article>h2 {
            background-color: #383838;
        }
        
        code {
            background-color: #707070;
        }
    }
    .remark-highlight pre {
        border-radius: 10px;
        box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
        font-size: 0.85em;
        margin-bottom: 1rem;
    }
    
    @media screen and (max-width:650px) {
        .remark-highlight pre {
            font-size: 0.8em;
        }
    }
</style>
<title>MD-CONVERTER</title>
</head>
<body>
<main>
<article>
${article}
</article>
</main>
</body>`;
    return docstring;
}