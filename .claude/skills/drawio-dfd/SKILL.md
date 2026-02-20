---
name: drawio-dfd
description: draw.ioを使用してデータフロー図（DFD）やAWSアーキテクチャ図を作成・編集するスキル。VSCode環境でdraw.ioのXMLを直接編集する想定。トリガー：「DFD」「データフロー図」「draw.io」「.drawio」ファイルの作成・編集、システムのデータの流れの可視化、プロセスとデータストアの関係図の作成、「AWSアーキテクチャ図」「AWS構成図」「AWSアイコン」を使った図の作成。
---

# draw.io DFD作成スキル

VSCode上でdraw.ioのXMLを直接編集し、データフロー図（DFD）を作成する。

## ⚠️ 重要：Claude Code利用時の必須ルール

PNG出力時の問題を防ぐため、以下を必ず守ること。詳細は [references/best-practices.md](references/best-practices.md) を参照。

1. **フォント設定**: 全テキスト要素に`fontFamily`を明示（`defaultFontFamily`だけでは不十分）
2. **日本語の幅**: 1文字あたり30-40pxを確保（幅不足は意図しない改行の原因）
3. **矢印の配置**: XMLの記述順が描画順。矢印を先に記述して最背面に
4. **ラベルとの距離**: 矢印とラベルは最低20px以上離す

## クイックスタート

### 1. テンプレートをコピー
テンプレート:`skill/assets/template-empty.drawio`
出力先:`GMA/docs/drawIO/`

### 2. 要素を追加
XMLの`<root>`内、`<mxCell id="1" parent="0"/>`の後に要素を追加。

### 3. VSCodeで開く
draw.io拡張機能がインストールされていれば、`.drawio`ファイルをダブルクリックで可視化。

## DFD要素の追加手順

### 外部エンティティ（システム境界外のアクター）
```xml
<mxCell id="entity_{名前}" value="{表示名}" style="rounded=0;whiteSpace=wrap;html=1;fillColor=#f5f5f5;strokeColor=#666666;fontColor=#333333;fontSize=18;fontFamily=Noto Sans JP;shadow=1;" vertex="1" parent="1">
  <mxGeometry x="{x}" y="{y}" width="120" height="60" as="geometry"/>
</mxCell>
```

### プロセス（データ処理）
```xml
<mxCell id="process_{番号}" value="&lt;b&gt;{番号}&lt;/b&gt;&lt;hr&gt;{プロセス名}" style="ellipse;whiteSpace=wrap;html=1;fillColor=#dae8fc;strokeColor=#6c8ebf;fontSize=18;fontFamily=Noto Sans JP;" vertex="1" parent="1">
  <mxGeometry x="{x}" y="{y}" width="100" height="80" as="geometry"/>
</mxCell>
```

### データストア（データ保存場所）
```xml
<mxCell id="datastore_{名前}" value="D{番号} | {ストア名}" style="shape=partialRectangle;whiteSpace=wrap;html=1;left=1;right=1;fillColor=#fff2cc;strokeColor=#d6b656;fontSize=18;fontFamily=Noto Sans JP;" vertex="1" parent="1">
  <mxGeometry x="{x}" y="{y}" width="160" height="40" as="geometry"/>
</mxCell>
```

### データフロー（矢印）
```xml
<mxCell id="flow_{from}_{to}" value="{フロー名}" style="edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;endArrow=classic;endFill=1;fontSize=14;fontFamily=Noto Sans JP;" edge="1" parent="1" source="{source_id}" target="{target_id}">
  <mxGeometry relative="1" as="geometry"/>
</mxCell>
```

## AWSアイコンの使用

### 基本構文
```xml
<mxCell id="{id}" value="{ラベル}" style="shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.{service_name};fillColor={色};strokeColor=#ffffff;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontFamily=Noto Sans JP;aspect=fixed;" vertex="1" parent="1">
  <mxGeometry x="{x}" y="{y}" width="78" height="78" as="geometry"/>
</mxCell>
```

### 主要サービスと色
| カテゴリ | fillColor | サービス例 |
|---------|-----------|-----------|
| Compute | #D05C17 | `lambda`, `ec2`, `ecs` |
| Storage | #277116 | `s3`, `elastic_block_store` |
| Database | #2E73B8 | `dynamodb`, `rds`, `aurora` |
| Network | #8C4FFF | `vpc`, `cloudfront`, `api_gateway` |
| Security | #DD344C | `iam`, `cognito`, `waf` |

詳細は [references/aws-icons.md](references/aws-icons.md) を参照。

## レイアウト指針

### 標準配置（左→右）
```
x=50:   外部エンティティ（入力側）
x=200:  プロセス（レベル1）
x=400:  プロセス（レベル2）/ データストア
x=600:  外部エンティティ（出力側）
```

### 垂直間隔
- 要素間: 80px
- データストアは関連プロセスの下に配置（y +150px程度）

## 詳細リファレンス

- **ベストプラクティス**: [references/best-practices.md](references/best-practices.md) - Claude Code向けTips、設計原則、チェックリスト
- **DFD要素の詳細**: [references/dfd-elements.md](references/dfd-elements.md) - 全要素のXMLテンプレートと色パターン
- **XML構造の詳細**: [references/xml-structure.md](references/xml-structure.md) - draw.ioのファイル構造とスタイル属性
- **AWSアイコン**: [references/aws-icons.md](references/aws-icons.md) - AWSサービスアイコン一覧とグループ要素

## アセット

- `assets/template-empty.drawio` - 空のDFDテンプレート
- `assets/sample-order-system.drawio` - サンプル（注文処理システム）
- `assets/sample-aws-serverless.drawio` - サンプル（AWSサーバーレスアーキテクチャ）

## 注意事項

1. **ID重複禁止**: 各mxCellのidは一意であること
2. **source/target**: edgeのsource/targetは存在するidを指定
3. **HTMLエスケープ**: valueに`<`を含む場合は`&lt;`を使用
4. **親要素**: 図形は`parent="1"`を指定（デフォルトレイヤー）
