from zipfile import ZipFile
from pathlib import Path
import shutil


def rmdir(pathstr: str):
    """
    pathstrは削除するフォルダ
    """
    shutil.rmtree(pathstr)


def zipfolder(pathstr: str):
    """
    pathstrは画像が格納されているフォルダ
    pathstrと同じ階層に、`フォルダ名`＋.zip　を作成する。
    （patstrの中にzipファイルを作る訳ではない。）
    """
    path = Path(pathstr)
    parent = path.parent
    zfname = parent / (path.stem + ".zip")

    with ZipFile(zfname, "w") as zf:
        for d in path.iterdir():
            # フルパスにするとフォルダ階層込みで圧縮されるため、
            # 第二引数（arcname）にファイル名のみを設定
            zf.write(d, d.name)


def myzip(pathstr: str):
    """entry point"""
    zipfolder(pathstr)
    rmdir(pathstr)


if __name__ == "__main__":
    # test
    import sys
    try:
        fol = sys.argv[1]
        zipfolder(fol)
        rmdir(fol)
    except IndexError as error:
        print(error)
        sys.exit(1)
