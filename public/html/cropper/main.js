
const IMAGES = [
    ".jpg", ".jpeg",
    ".JPG", ".JPEG",
    ".png", ".PNG",
    ".tiff", ".TIFF",
    ".tif", ".TIF",
    ".gif", ".GIF",
    ".bmp", ".BMP",
]

function submit(e) {
    e.preventDefault();
    const form = document.querySelector(".form__self");
    const data = new FormData(form);
    // check
    for (const pic of data.getAll("pics")) {
        if (pic.name === "") {
            alert("画像を選択してください")
            return;
        }
        const splitName = pic.name.split(".");
        if (splitName.length === 1) {
            alert(`拡張子が無いファイルはダメ:${pic.name}`);
            return;
        }
        const testName = "." + splitName.slice(-1);
        if (!IMAGES.includes(testName)) {
            alert(`この拡張子は対応していません:${pic.name}`)
            return;
        }
    }

    //ここまで来たらエラーなし。lockモーダルを表示
    const lock = document.querySelector(".lock__modal");
    lock.style.display = "block";
    fetch(form.action, {
        method: "POST",
        body: data
    })
        .then(res => {
            if (!res.ok) {
                throw res;
            }
            return res.blob();
        })
        .then(blob => {
            download(blob);
        })
        .catch(res => {
            res.text().then(err => alert(err));
        })
        .finally(v => {
            lock.style.display = "none";
        });
}

function download(data) {
    const url = URL.createObjectURL(data);
    const a = document.createElement("a");
    a.href = url;
    a.download = "zen-crop.zip";
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    // firefox 対策とのこと
    setTimeout(() => {
        URL.revokeObjectURL(url);
        a.remove();
    }, 3000);
}
function main() {
    // 入力欄をフォーカスしたときに自動でラジオボタンが選択された状態にする。
    const widthNode = document.querySelector(".new-width__input");
    widthNode.addEventListener("focus", e => {
        const radioNode = document.querySelector(".new-width__radio");
        radioNode.checked = true;
    });

    // リサイズ無しのラジオボタンを選択した時は、new-widthのvalueをブランクにする
    const defNode = document.querySelector(".no-resize");
    defNode.addEventListener("change", e => widthNode.value = "");

    // submitカスタム
    const subNode = document.querySelector(".submit__button");
    subNode.addEventListener("click", submit);

}
window.addEventListener("load", main);