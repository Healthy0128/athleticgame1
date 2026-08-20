# 実BGM・SE適用版

この版では、実際のOGG音源をWebから読み込んで再生します。

## BGM
- stage-loop: Two Simple Game Music Loops / qubodup
- 配布元の再配布プロジェクト上でCC0として整理された音源
- 実行時URL:
  https://raw.githubusercontent.com/blancmathis/Super_Bash_Folds/main/public/assets/audio/open/music/battle-loop.ogg

## SE
Kenney由来のCC0ゲームSEを利用しています。

割り当て:
- jump: dodge.ogg
- coin: item-pickup.ogg
- stomp: hit-light.ogg
- damage / fall: hit-heavy.ogg
- clear: game-set.ogg
- land: land.ogg

## ライセンス
- Kenney sound effects: CC0 1.0
- Two Simple Game Music Loops / qubodup: CC0 1.0

参照:
https://github.com/blancmathis/Super_Bash_Folds/blob/main/public/assets/audio/LICENSES.md

現在は公開URLから読み込む構成です。オフライン化する場合は、各OGGをプロジェクト内に保存してURLを相対パスへ変更してください。
