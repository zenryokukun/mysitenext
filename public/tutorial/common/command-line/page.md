---
author: 全力君
date: 2024-2-1
---

# コマンド・ラインとは

<nav class="tbl-contents">
<div class="tbl-title">目次</div>
<ul>
<li><a href="#about">コマンド・ラインとは</a></li>
<li><a href="#importance">何故必要？</a></li>
<li>
  <a href="#windows-open-cmd">コマンド・プロンプトを起動（Windows）</a>
  <ul>
    <li><a href="#from-startmenu">スタートメニューから開く</h3>
    <li><a href="#from-searchbar">タスクバーの検索バーから開く</h3>
    <li><a href="#from-filename">「ファイル名を指定して実行」から開く</h3>
  </ul>
</li>
<li><a href="#powershell">PowerShellについて</a></li>
<li><a href="#terminology">用語の補足</a></li>
</ul>
</nav>

<h2 id="about">コマンド・ラインとは</h2>

まずは言葉で説明するより、画像を見ていただいたほうが早いと思います。

<img src="/tutorial/common/command-line/cmd.jpg" alt="windows-command-prompt" width="617" height="201"/>

PCをあまり触らない方でも、一度は見たことがあるのではないでしょうか。

これは、Windows標準のコマンド・ラインツールである、コマンド・プロンプトと呼ばれるものです。

ここにコマンドを打ち込むと、ファイルを開いたり、プログラムを実行したり、フォルダを作成・削除したりすることができます。普段マウス等で行う操作は、ほとんど
コマンド・プロンプト上で行うことができます。

コマンドラインは、コマンド・プロンプトのように「<span class="hl">ユーザが文字を打ってPCを操作するためのツール</span>」です。

Windowsにはコマンド・プロンプトがあるように、Macにはターミナルと呼ばれるコマンドライン・ツールがあります。Linuxに至っては、デスクトップ版でもない限りコマンド・ラインからでないと操作できません。OSを問わず、どのPCにもコマンドライン・ツールは標準搭載されています。

<div class="regard"><p>
Windowsには、<b>PowerShell</b>と呼ばれるコマンドライン・ツールも標準搭載されています。
</p></div>

<h2 id="importance">何故必要？</h2>

書いたプログラムは、基本的にどの言語であってもコマンドラインから実行します。

また、外部パッケージをインストールする時も、だいたいの言語では付属するパッケージ・マネージャと呼ばれるコマンドライン・ツールを使ってインストールを行います。

さらに、GoやC言語のようにコンパイルが必要な言語の場合、コンパイルはコマンドラインから行う必要があります。加えて、[git](https://git-scm.com/)のようなプログラミング関連のツールも、基本的にはコマンドライン・ツールとして提供されます。

もっと言うと、PythonやNode.jsのような言語は、それ自体をコマンドライン・ツールとして利用することもできます。

基本的に、プログラミングを行う上で<span class="hl">コマンドラインを避けて通ることはできません</span>。

とは言え、書いたプログラムを動かすだけならそこまで高度な知識は必要ありません。必要なコマンドを、必要な時に覚えていけばOKです。

また、コマンドラインで入力する内容は、ファイルに書いておき、そこから実行することも可能性です。そのため、PCの設定や、フォルダ・ファイル操作を**自動化**する上でも重要なツールとなります。

<div class="regard"><p>
ブラウザ版JavaScriptのように、コマンドラインから起動しない言語もあります。<br>
また、コンパイルやプログラムの実行等、GUIで操作可能なエディタやIDEもあります。<br>
</p></div>

<h2 id="windows-open-cmd">コマンド・プロンプトを起動（Windows）</h2>

方法はいくつかあります。何度も行う操作なので、なるべくマウスを使わない方法がお勧めですが、好きなやり方で構いません。

なお、画面のキャプチャはWindows11で取得しています。Windows10だと見た目が異なりますが、基本的な操作方法は同じです。

いずれの手順でも、「cmd」の部分を「powershell」に変えれば、PowerShellを起動することもできます。

<h3 id="from-startmenu">スタートメニューから開く</h3>

#### スタートメニューを開く

タスクバーのWindowsロゴをクリックします。キーボードの「Windowsロゴ」キーを押しても同じ画面が開きます。

<img src="/tutorial/common/command-line/windows-logo.jpg" alt="windows-logo" width="500" height="67">

スタートメニューが立ち上がります。

<img src="/tutorial/common/command-line/windows-start-menu.jpg" alt="windows-start-menu" width="500" height="404">

上部の検索バーに「cmd」と入力します。検索バーはクリックしなくても大丈夫です。

<img src="/tutorial/common/command-line/windows-search-cmd.jpg" alt="windows-search-cmd" width="750" height="321">

「コマンド プロンプト」が表示されるので、そのままEnterキーを押すと、コマンド・プロンプトが起動します。

<img src="/tutorial/common/command-line/windows-cmd.jpg" alt="windows-command-prompt" width="650" height="170">

一連の操作は、「Windowsロゴ」キー→「cmd」→「Enter」キーと、<span class="hl">キーボード操作のみ</span>で行うことができます。

<h3 id="from-searchbar">タスクバーの検索バーから開く</h3>

タスクバーにある検索バーに「cmd」と入力し、Enterキーを押せばコマンド・プロンプトを起動できます。

<img src="/tutorial/common/command-line/windows-taskbar-search.jpg" alt="windows-searchbar-in-taskbar" width="391" height="51">

「Windowsロゴ 」キーと「S」キーを同時に押すと、この検索バーにフォーカスを当てることができます（クリックと同じ効果が得られます）。

「Windowsロゴ ＋ S」→「cmd」→「Enter」キーと操作することで、キーボード操作のみでコマンド・プロンプトを開くことができます。

<h3 id="from-filename">「ファイル名を指定して実行」から開く</h3>

「Windowsロゴ」キーと「R」キーを押すと、「ファイル名を指定して実行」の画面が開きます。ここに「cmd」と入力しEnterキーを押せば、コマンド・プロンプトが開きます。

<img src="/tutorial/common/command-line/windows-exec-by-filename.jpg" alt="windows-exec-by-filename" width="446" height="270">

直近の入力内容を記録してくれるので便利です。個人的にはこれをよく使っています。

<h2 id="powershell">PowerShellについて</h2>

Windowsにはコマンド・プロンプトと、[PowerShell](https://learn.microsoft.com/ja-jp/powershell/scripting/overview?view=powershell-7.4)の2つのコマンドライン・ツールが標準で搭載されています。

PowerShellのほうが新しく多機能な反面、学習コストは高いと思います。

コマンド・プロンプトのコマンドも、そのまま使えるものもありますが、文法等は異なるため、基本的には別物です。互換性がある訳ではありません。

そして、いずれコマンド・プロンプトが廃止され、PowerShellに統一されていくのかというと、[Microsoft社の開発ブログ](https://devblogs.microsoft.com/commandline/rumors-of-cmds-death-have-been-greatly-exaggerated/)によると、そういう訳ではないようです。

「じゃあどちらを使えば良いの？」と思われるかもしれませんが、プログラムを動かしたり等、このチュートリアルで扱う範囲では、<span class="hl">どちらでも問題ありません</span>。

そもそも、ここで扱うコマンドは、コマンド・プロンプトでもPowerShellでも、どちらでも動くものがほとんどになると思います。

このチュートリアルでは、特段断りの無い限り、コマンド・プロンプトを使っていきます。PowerShellとコマンドが異なる場合のみ、補足をしていくことにします。

<h2 id="terminology">用語の補足</h2>

このページでは、「コマンドライン」「コマンド・プロンプト」「ターミナル」といった用語が出てきました。実は他にも、似たようなワードがあります。

ここでまとめて整理し、このチュートリアルでは以下の意味合いで使っていきたいと思います。ただ、ネット記事や普段の会話では、あまり厳密に使い分けることはないと思います。あくまでこのチュートリアル内での分類ということでご理解ください。

### コマンドライン

ユーザが**文字**を打ってPCを操作するためのツールです。コマンドライン・インターフェース（**CLI**: *Command Line Interface*）と呼ぶこともあります。

### コマンド・プロンプト 

Windows標準のコマンドラインです。Windows固有のコマンドを入力して操作します。「CMD」と呼ばれることもあります。

### ターミナル

MacやLinux標準のコマンドラインです。bashやzshといった、UNIX系のコマンドを入力して操作します。

### CUI

*Character User Interface*の略です。*Command Line Interface*と同じ意味です。ユーザが文字入力で操作するUIのことです。なのでコマンドラインのUIは、CUIです。対になるUIとして、*Graphical User Interface*(GUI)があります。GUIは、普段のPCを使う時のように、マウス等で画面上のアイコン等を操作するUIです。
