# ファイル・パスとは

<h2 id="start">はじめに</h2>

コマンド・プロンプトに限った話ではありませんが、コマンドライン・ツールを扱う際、「カレント・ディレクトリ」の概念や、「絶対パス」「相対パス」を理解しておく必要があります。

このページでは、コマンドライン・ツールに触れるための事前知識として、Windowsのファイル・パスに関する解説をします。

<h2 id="path">Windowsのファイル・パスについて</h2>

Windows上にあるフォルダやファイルの保存場所のことを、「パス（path）」といいます。人によってはファイル・パスと呼ぶかもしれません。

例えば、デスクトップ上に保存した「test.txt」ファイルのパスは、```C:\Users\bathi\Desktop\test.txt```となります。「bathi」の部分はWindowsのユーザ名のため、人によって値は異なります。

パスの概要や確認方法は、Windows10ですが[NEC社LavieのFAQ](https://faq.nec-lavie.jp/qasearch/1007/app/servlet/relatedqa?QID=020862)が分かりやすかったので参考にしてください。

<h3 id="path-drive">ドライブ名</h3>

```C:\Users\bathi\Desktop\test.txt```の「C:」の部分は、ドライブ名となります。ドライブ・レターと呼ぶこともあります。

Windows10以降は、基本はCドライブ１つしかありません。そのため、あまり意識する必要はありません。

<div class="regard">
<p>
外付けハードディスク等を接続すると、「D:」等、C以外のドライブが割り当てられます。この場合、<code>D:\img\hakone.jpg</code>のように、C:以外のドライブのパスとなります。
</p>
</div>

<h3 id="path-delimiter">区切り文字について</h3>

```C:\Users\bathi\Desktop\test.txt```の、「C:」はドライブ名、「Users」「bathi」「Desktop」はフォルダ名、「test.txt」はファイル名です。

いずれも、「\」（バックスラッシュ）記号で区切られています。環境によっては、「<span style="font-family:monospace,sans serif">\\</span>」と表示されるかと思います。表示の違いだけで、動作は同じです。

ドライブ名、フォルダ名、ファイル名は「\」(<span style="font-family:monospace,sans serif">\\</span>)で区切るのがルールとなります。

<div class="regard">
<p>
Windowsでは日本語フォントだと「\」が「<span style="font-family:monospace,sans serif">\</span>」で表示される場合があります。しかし、内部的な値は同じです。
</p>
<p>
日本語対応キーボードでも、それぞれの記号の入力キーがありますが、同じ文字コードが割り当てられているため、<b>どちらを入力しても同じ動作</b>になります。
</p>
<p>このチュートリアルでも混在するかもしれませんので、<b>『「\」と「<span style="font-family:monospace,sans serif">\</span>」は同じもので、どちらを入力しても良い</b>』と覚えていただければと思います。</p>
<p>
詳細は<a href="https://www.otsuka-bs.co.jp/web-creation/blog/archive/20230807-01.html">大塚ビジネスサービス社</a>のサイトが参考になると思います。
</p>
</div>

<h3 id="upper-lower-case">大文字と小文字の区別について</h3>

Windowsのファイル・パスでは、アルファベットの**大文字と小文字は区別されません**。```c:\users\bathi```も```C:\USERS\BATHI```も同じパスとして扱われます。

試しに、同じフォルダに「TEST.txt」と「test.txt」を作成してみてください。同じファイル名として扱われるため、保存できないことが確認できるはずです。

<div class="regard">
<p>
Linuxでは大文字と小文字は区別されます。
</p>
</div>

<h2 id="path-absolute">絶対パス(absolute path)</h2>

```C:\Users\bathi\Desktop\test.txt```や、```D:\img\travel```のように、対象のファイル/フォルダのパスをドライブ名から記述したものを<span class="hl">絶対パス（absolute path）</span>と呼びます。

<h2 id="path-relative">相対パス（relative path）</h2>

現在いるフォルダを起点にパスを記述したものを<span class="hl">相対パス</span>と呼びます。

また、現在いるフォルダのことを、<span class="hl">カレント・ディレクトリ（current directory）</span>と呼びます。カレント・ディレクトリは「```.```」（半角ピリオド）で表します。

例えば```C:\Users\bathi\Desktop\test\path```のフォルダ構成が以下のとおりだったとします。

```powershell {5} showLineNumbers
C:\Users\bathi\Desktop\test\path
│  メモ.txt
│
├─img
│  ├─2023
│  │  │  asakusa.jpg
│  │  │
│  │  └─hakone
│  │          大涌谷.jpg
│  │          湯本.jpg
│  │
│  └─2024
│          yodobashi.jpg
│
└─movie
       birthday-party.mpeg
       hakone-travel.mpeg
```

そして、**カレント・ディレクトリは5行目の「2023」フォルダ**だとします。絶対パスでいうと、```C:\Users\bathi\Desktop\test\path\img\2023```にいるということです。

2023フォルダを起点に、各ファイルやフォルダを表すと以下のとおりになります。

<h3 id="same-folder">直下のファイルやフォルダ</h3>

「2023」フォルダ直下のファイルやフォルダの表し方を見ていきます。

- 6行目:  ```.\asakusa.jpg```
- 8行目: ```.\hakone```
- 9行目： ```.\hakone\大涌谷.jpg```
- 10行目: ```.\hakone\湯本.jpg```

上述のとおり、カレント・ディレクトリは「```.```」で表します。そして、フォルダ名やファイル名は「```\```」で区切るのがルールなので、全て「```.\```」からはじまっています。

<h3 id="one-above">1つ上の階層のファイルやフォルダ</h3>

次は「2024」フォルダを見てみます。

カレント・ディレクトリの１つ上の階層は、相対パスでは「```..```」(ピリオド2つ)で表します。

「2024」フォルダは「img」フォルダの下にあります。「img」フォルダは、カレント・ディレクトリから見ると1つ上の階層にあるので、「```..```」で表すことができます。

以上を踏まえると、以下のようになります。

- 12行目: ```..\2024```
- 13行目: ```..\2024\yodobashi.jpg```

「```..```」が「img」フォルダを表しているのがポイントです。

<h3 id="higher-above">より上の階層のファイルやフォルダ</h3>

次は「movie」フォルダを見てみます。

「movie」フォルダは「img」フォルダと同じ階層にあります。そのため、「2023」フォルダから見ると、1つ上の階層の「img」フォルダから、**さらに1つ上の階層のフォルダ**（「path」フォルダ）から表す必要があります。

2階層上は相対パスでは「```..\..```」で表します。

- 15行目: ```..\..\movie```
- 16行目: ```..\..\movie\birthday-party.mpeg```
- 17行目: ```..\..\movie\hakone-travel.mpeg```

さらに上の階層の場合でも、考え方は同じです。

<h2 id="linux">Linuxの場合</h2>

ここまではWindowsを前提に、ファイル・パスについて解説をしました。

しかし、Linuxの場合でもほぼ同じです。相違点は以下のとおりです。もしChromebookをお使いの場合は参考にしてください。

- 「C:」のようなドライブ・レターがない
- 区切り文字は「/」（普通のスラッシュ）

区切り文字はWindowsの「\」（バックスラッシュ）と似ていますので注意（？）してください。向きが逆です。

<h2 id="summary">まとめ</h2>

ポイントをまとめます。

<div class="point">
<ul>
  <li><b>パス</b>: フォルダやファイルの保存場所の経路です。Windowsでは大文字と小文字は区別されません。</li>
  <li><b>区切り文字</b>: パスのドライブ名、フォルダ名、ファイル名を区切る文字です。Windowsの区切り文字は「\」です。<span style="font-family:monospace,sans serif">「\」</span>と表示される場合もありますが、同じです。</li>
  <li><b>絶対パス</b>: フォルダやファイルのパスを、ドライブ名から記述したものです。</li>
  <li><b>カレント・ディレクトリ</b>: 現在いるフォルダ（＝ディレクトリ）のことです。</li>
  <li><b>相対パス</b>: フォルダやファイルのパスを、カレント・ディレクトリを起点に記述したものです。カレント・ディレクトリは「.」で表します。一つ上の階層は「..」、2つ上の階層は「..\..」、3つ上の階層は「..\..\..」のように表します。</li>
</ul>
</div>