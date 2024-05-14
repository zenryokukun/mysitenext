---
author: 全力君
date: 2024-5-1
---

# エディターとは

<nav class="tbl-contents">
<div class="tbl-title">目次</div>
<ul>
  <li><a href="#editor">エディターって何？</a></li>
  <li>
    <a href="#famous">有名な無料エディタ</a>
    <ul>
      <li><a href="#vscode">Visual Studio Code (VSCode)</a></li>
      <li><a href="#sakura">サクラエディタ</a></li>
      <li><a href="#intellij">IntelliJ IDEA</a></li>
    </ul>
  </li>
  <li><a href="#recommend">お勧めのエディタ</a></li>
  <li><a href="#sakura-install">サクラエディタのインストール方法</a></li>
  <li><a href="#vscode-install">Visual Studio Codeのインストール方法</a></li>
</ul>
</nav>

<h2 id="editor">エディターって何？</h2>

プログラムは、基本的にはテキストファイルに記述し、実行します。「（テキスト）エディター」とは、そのテキストファイルを作成するためのツールのことです。

Windowsなら「メモ帳（notepad）」、Macなら「テキストエディット」、Chromebookなら「Text」等、大体のパソコンには標準搭載されているツールです。プログラムを書いたことがなくても、簡単なメモをとったりするときに、使ったことがある方がほとんだと思います。

もちろん、これらでプログラㇺを書くことは可能です。ただ、プログラミングに特化したツールではないため、機能は限定されます（特にWindowsのメモ帳）。そのため、専用のエディタを別途インストールして利用することが一般的です。

最近では無料のエディタでも、プログラムの文法に応じて見やすく色を付けてくれたり、入力の自動補完や予測変換をしてくれたり、コマンドライン・ツールが内蔵されていたり、非常に高機能です。

このページでは、プログラミングをこれからはじめる方向けに、有名な無料のエディタと、私のお勧めを紹介します。

最終的に、どのエディタを使うかは個人の好みですが、参考になれば幸いです。

<h2 id="famous">有名な無料エディタ</h2>

<h3 id="vscode">Visual Studio Code (VSCode)</h3>

[Visual Studio Code](https://code.visualstudio.com/)は、マイクロソフト社が2015年にリリースしたオープンソースのエディタです。Python、JavaScript、Go、Ruby、PHP、Rust、Swfit、、等、大体の言語に対応しています。クロスプラットフォーム対応なので、WindowsでもMacでも、Linuxでも利用できます。今一番人気と言っても過言ではないと思います。私も使っていますし、私の会社でもプログラムを書く部門のPCにはインストールされています。

ファイルやフォルダの選択もエディタから可能ですし、コマンドライン・ツール（bash,powershell,Command Prompt等）も統合されています。プログラムのバージョン管理によく使われるツール（[git](https://git-scm.com/)）のGUIも内蔵されており、エディタだけで**プログラミングに必要な操作をほぼ完結させることが可能**です。

**Extensions**と呼ばれる拡張機能が豊富にあり、しかも強力なものが多いです。設定項目もたくさんあり、カスタマイズ性が非常に高く、様々なニーズに応えられるのが人気の理由だと感じます。キーボード・ショートカットも豊富で、カスタムも可能なので、慣れればキーボードをほとんど使わずに操作することも出来ます。

個人的には、画像ファイルや動画ファイルもエディタで開けるのがとても便利に感じます。

裏を返せば、機能が豊富で覚えることが多く、学習コストが高いとも言えます。特に、プログラミングに初めて触れる方は「こんなに機能いらない、、、覚えること増やさないで」と感じてしまうかもしれません。

見た目はこんな感じです。細かい部分は写真では確認できないかもしれませんが、情報量の多さは伝わると思います。

<img src="/tutorial/common/editor/vscode.jpg" alt="vscode-image" width="800" height="450" loading="lazy" />

なお、Microsoft社の似た名前の製品に、[Visual Studio](https://visualstudio.microsoft.com/ja/)がありますが、これは別の製品となります。ややこしいですね。

<h3 id="sakura">サクラエディタ</h3>

[サクラエディタ](https://sakura-editor.github.io/)はWindows専用の国産エディタです。

昔からあるエディタで、使用感は「メモ帳」に似ています。機能はキーワードの強調、複数ファイル検索等がありますが、VSCode等と比べると、必要最低限に抑えられています。機能は限定されている反面、覚えることは少なく、ある意味初めてプログラムを書く方にはお勧めできるエディタと言えます。とはいえ、最近のエディタと比べると古く感じてしまうのは事実なので、手放しでお勧めは出来ませんが、、、。

見た目は以下のような感じで、とてもシンプルです。メモ帳と似ていますね。

<img src="/tutorial/common/editor/sakura.jpg" alt="sakura-editor-image" width="500" height="225" loading="lazy" />

私も初めはサクラエディタを使っていたので、思い入れのあるエディタです。入力補完や静的エラー解析もないので、今となっては不便と感じる場面は多いです。しかし、その分自分で調べて正確に入力する必要があるため、不便な反面、**プログラミングが身に付く速度も速い**と言えると思います。

<h3 id="intellij">IntelliJ IDEA</h3>

[IntelliJ IDEA](https://www.jetbrains.com/ja-jp/idea/)は、JetBrains社が作成したIDE(統合開発環境)です。JetBrains社は、プログラミング言語のKotlinを開発した会社としても有名ですね。こちらもクロスプラットフォーム対応なため、Windows、Mac、Linuxで動作します。厳密には「エディタ」ではなく、「開発環境」です。プログラムを書いて実行する上では、特に区別をする必要性はないと思いますので、エディタとして紹介させていただきます。

VSCodeと同じく、コマンドラインやバージョン管理ツールが内蔵しており、負けじと多機能です。ただし、Java/Kotlinに特化したIDEとなるため、他の言語で使うわれることはあまりないかもしれません。一応、プラグインを使えばJavaScript、Go、Dart、Python等といった言語にも対応しているようです。反面、Java/Kotlinを使うのであれば、有力なツールになると思います。

見た目はこんな感じです。VSCodeと同じくらいの情報量ですね。

<img src="/tutorial/common/editor/intellij.jpg" alt="intellij-image" width="800" height="450" loading="lazy" />

<h2 id="recommend">お勧めのエディタ</h2>

プログラミングを学んでいくと、多くの方はどこかのタイミングでVisual Studio Codeを使うことになると思います。そのくらい今人気のエディタです。しかし、便利に使うためにはそれなりに覚えることもあるため、プログラミングをこれから始める方には、少しハードルが高く感じてしまうこともあると思います。

個人的には、簡単なプログラムを書いて、実行するまでの流れに慣れてきてから、Visual Studio Codeに切り替えるのが良いと思っています。そのため、最初のエディタとしてお勧めするのは、「サクラエディタ」です。とはいえ、ある程度慣れたと感じたら、すぐ切り替えを検討して良いです。

サクラエディタはWindowsしか対応していませんが、軽量なエディタなら何でも大丈夫です。Macは持っていないので標準搭載されているエディタの性能は分かりませんが、Chromebookの「Text」なら十分サクラエディタの代わりになると思います。ただし、Windowsの「メモ帳」はお勧めしません。

Java/Kotlinを学ぶ方なら、**IntelliJ IDEA**も検討しても良いと思います。しかし、ある程度Javaの開発環境の知識がないと、使い方を覚えるのに時間がかかるかもしれません。まずは、上記と同じように、サクラエディタで簡単なプログラムを書いて、コンパイルして実行する流れを掴んでから切り替えたほうが良いと思います。

<h2 id="sakura-install">サクラエディタのインストール方法</h2>

[サクラエディタのGitHubリポジトリ](https://github.com/sakura-editor/sakura/releases)からダウンロードできます。

インストール手順の詳細は、ドスパラ社の[サクラエディタの使い方、インストールから基本設定や便利な機能までをご紹介](https://www.dospara.co.jp/5info/cts_str_pcuse_sakuraeditor.html)に分かりやすく記載されていますので、参考にしてください。

<h2 id="vscode-install">Visual Studio Codeのインストール方法</h2>

[Visual Studio Code](https://code.visualstudio.com/)からダウンロードできます。

インストール手順は「Let'sプログラミング」さんの[Visual Studio Codeのダウンロードとインストール](https://www.javadrive.jp/vscode/install/index1.html)に詳しく記載されています。また、日本語表示にするためには、パッチをあてる必要があります。手順は[Visual Studio Codeを日本語化する](https://www.javadrive.jp/vscode/install/index4.html)に詳しく記載されていますので、参考にしてください。英語の方がネット上の情報も多いため、そのまま使っても問題ないと思います。私も英語のまま使っています。