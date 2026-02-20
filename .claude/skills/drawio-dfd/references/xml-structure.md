# draw.io XML構造リファレンス

## 基本構造

```xml
<mxfile host="app.diagrams.net" modified="{ISO日時}" agent="..." version="...">
  <diagram id="{diagram_id}" name="{ページ名}">
    <mxGraphModel dx="..." dy="..." grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="827" pageHeight="1169">
      <root>
        <mxCell id="0"/>
        <mxCell id="1" parent="0"/>
        <!-- ここに図形要素を配置 -->
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
```

## 必須要素

### mxCell id="0"
ルートセル。すべての要素の祖先。削除不可。

### mxCell id="1"
デフォルトレイヤー。図形要素のparentとして使用。削除不可。

## mxCell属性

### 共通属性
| 属性 | 説明 | 例 |
|------|------|-----|
| id | 一意識別子 | `"process_1"` |
| value | 表示テキスト | `"注文処理"` |
| style | スタイル定義 | `"ellipse;fillColor=#dae8fc;"` |
| vertex | 図形の場合 | `"1"` |
| edge | 線の場合 | `"1"` |
| parent | 親要素ID | `"1"` |
| source | 接続元ID（edge用） | `"process_1"` |
| target | 接続先ID（edge用） | `"datastore_1"` |

### mxGeometry属性
| 属性 | 説明 | 例 |
|------|------|-----|
| x | X座標 | `"200"` |
| y | Y座標 | `"100"` |
| width | 幅 | `"120"` |
| height | 高さ | `"60"` |
| relative | 相対位置（edge用） | `"1"` |

## スタイル文字列

セミコロン区切りのkey=value形式。

### よく使うスタイル属性
```
shape=ellipse          # 形状
rounded=1              # 角丸
whiteSpace=wrap        # テキスト折り返し
html=1                 # HTMLテキスト有効
fillColor=#dae8fc      # 背景色
strokeColor=#6c8ebf    # 線色
fontColor=#333333      # 文字色
fontSize=12            # フォントサイズ
fontStyle=1            # 太字(1), 斜体(2), 下線(4)の組み合わせ
align=center           # 水平配置
verticalAlign=middle   # 垂直配置
shadow=1               # 影
```

### エッジ（線）のスタイル
```
edgeStyle=none                    # 直線
edgeStyle=orthogonalEdgeStyle     # 直角折れ線
edgeStyle=elbowEdgeStyle          # 肘型
curved=1                          # 曲線
endArrow=classic                  # 矢先形状
endFill=1                         # 矢先塗りつぶし
startArrow=none                   # 始点矢印なし
strokeWidth=2                     # 線幅
dashed=1                          # 破線
dashPattern=3 3                   # 破線パターン
```

## IDの自動生成

一意のIDを生成する場合の推奨形式：
- 短いランダム文字列: `{要素種別}-{ランダム4-8文字}`
- 連番: `{要素種別}_{連番}`

例: `process_1`, `flow_2`, `datastore_3`

## 座標系

- 原点: 左上
- 単位: ピクセル
- 推奨グリッド: 10px単位（gridSize="10"）

## レイアウトのヒント

### 左から右（標準）
```
外部エンティティ → プロセス → データストア
x: 50          x: 200      x: 400
```

### 階層的（レベル別）
```
レベル0: コンテキスト図（単一プロセス）
レベル1: 主要プロセス分解
レベル2以降: 詳細プロセス
```

### 推奨間隔
- 要素間の最小距離: 60px
- 同種要素の垂直間隔: 80px
- プロセス間の水平間隔: 150px
