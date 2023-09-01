"""
縦長画像を任意の縦横比に切取り、拡大縮小し、zip化するスクリプト。
このスクリプトをコマンドラインのパラメタ付きで呼び出して使う。
第1引数:処理対象の画像が入っているパス。フルパスが望ましい
第2引数:新縦横比
第3引数:拡大縮小の有無
第4引数:拡大縮小後の横幅ピクセル数

例：.\\main.py C:\\documents\\pics 0.667 True 500
※なんかlinterでワーニングが出るのでバックスラッシュエスケープした。呼び出す際は不要

このスクリプト同階層に以下のスクリプトが必要：：
myzip.py

"""

from PIL import Image, ImageOps
from pathlib import Path
import sys
from myzip import myzip


def scale(image: Image.Image, ratio: float) -> Image.Image:
    """縦横比を維持してscaleする"""
    w, h = image.size
    param = (int(w*ratio), int(h*ratio))
    scaled_image = image.resize(param)
    return scaled_image


def scale_fixed_width(image: Image.Image, fixed_width: int) -> Image.Image:
    """fixed_widthになる比率でscaleする"""
    w, h = image.size
    ratio = fixed_width/w
    param = (int(w*ratio), int(h*ratio))
    return image.resize(param)


def crop(image: Image.Image, aspect_ratio: float) -> Image.Image:
    """
    widthは固定し、aspect_ratioの比率でheightを計算し切り取る。
    スマホの縦長写真をaspect_ratioの比率で横長にするのに使う想定
    aspect_ratio -> 9/16 2/3 3/4 1/1 etc
    """
    # aspect_ratio = height/width
    w, h = image.size

    # new height
    nh = w * aspect_ratio

    # 左上
    left_x = 0
    left_y = int(h/2 - nh/2)

    # 右下
    right_x = w
    right_y = int(left_y + nh)

    # 切り取り
    box = (left_x, left_y, right_x, right_y)
    cropped = image.crop(box)
    return cropped


def is_mobile(width: int, height: int) -> bool:
    """
    縦が横より10%以上大きかったらスマホ判定
    """
    return height * 1.1 >= width


def ext_lower(fpath: Path) -> Path:
    """
    大文字拡張子を小文字にする。pic.JPG ⇒ pic.jpg
    fpath　-> 画像パスのPathオブジェクト
    """
    ren = False  # rename flag

    # 拡張子の中に大文字が含まれればフラグ立てる。
    for ch in fpath.suffix:
        if ch.isupper():
            ren = True
            break

    if ren:
        ext = fpath.suffix.lower()
        fname = fpath.stem + ext
        newfpath = fpath.parent / fname
        return fpath.rename(newfpath)

    return fpath


def main(ipath: str, aspect: float, fixed_width=None):
    """entry point"""
    im = Image.open(ipath)

    #  縦長画像が縦横逆転するので、exif情報をもとに判定するように。
    im = ImageOps.exif_transpose(im)

    # aspectの比率で切り取る
    im = crop(im, aspect)

    # 固定横幅が指定されていれば縮小（拡大）する。
    if fixed_width:
        im = scale_fixed_width(im, fixed_width)

    im.save(ipath)  # 上書き保存しちゃう
    im.close()  # 閉じちゃう


if __name__ == "__main__":
    # 対応拡張子一覧
    images = [
        ".jpg", ".jpeg",
        ".JPG", ".JPEG",
        ".png", ".PNG",
        ".tiff", ".TIFF",
        ".tif", ".TIF",
        ".gif", ".GIF",
        ".bmp", ".BMP",
    ]

    pathstr: str = ""
    ratio: str = ""
    resize: str = ""
    width: str = ""

    try:
        pathstr = sys.argv[1]
        ratio = sys.argv[2]
        resize = sys.argv[3]
        width = sys.argv[4]
    except IndexError as error:
        print(error)
        sys.exit(1)

    root: Path = Path(pathstr)

    for d in root.iterdir():
        if d.suffix in images:
            targ_path = ext_lower(d)
            if resize == "default":
                main(str(targ_path), float(ratio))
            elif resize == "custom":
                main(str(targ_path), float(ratio), int(width))

    myzip(pathstr)
