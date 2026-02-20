# AWS アイコン XMLリファレンス

draw.ioでAWSアイコンを使用するためのガイド。

## 目次
1. [基本構文](#基本構文)
2. [カテゴリ別アイコン一覧](#カテゴリ別アイコン一覧)
3. [グループ（枠）](#グループ枠)

---

## 基本構文

### AWSサービスアイコン（標準）
```xml
<mxCell id="{id}" value="{ラベル}" style="sketch=0;outlineConnect=0;fontColor=#232F3E;gradientColor={gradientColor};gradientDirection=north;fillColor={fillColor};strokeColor=#ffffff;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.{service_name};" vertex="1" parent="1">
  <mxGeometry x="{x}" y="{y}" width="78" height="78" as="geometry"/>
</mxCell>
```

### シンプル版（最小構成）
```xml
<mxCell id="{id}" value="{ラベル}" style="shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.{service_name};fillColor={fillColor};strokeColor=#ffffff;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;aspect=fixed;" vertex="1" parent="1">
  <mxGeometry x="{x}" y="{y}" width="78" height="78" as="geometry"/>
</mxCell>
```

---

## カテゴリ別アイコン一覧

### Compute（コンピューティング）- オレンジ系
fillColor: `#D05C17` / gradientColor: `#F78E04`

| サービス | resIcon値 |
|---------|----------|
| EC2 | `mxgraph.aws4.ec2` |
| Lambda | `mxgraph.aws4.lambda` |
| ECS | `mxgraph.aws4.ecs` |
| EKS | `mxgraph.aws4.eks` |
| Fargate | `mxgraph.aws4.fargate` |
| Elastic Beanstalk | `mxgraph.aws4.elastic_beanstalk` |
| Batch | `mxgraph.aws4.batch` |
| Lightsail | `mxgraph.aws4.lightsail` |

### Storage（ストレージ）- グリーン系
fillColor: `#277116` / gradientColor: `#60A337`

| サービス | resIcon値 |
|---------|----------|
| S3 | `mxgraph.aws4.s3` |
| EBS | `mxgraph.aws4.elastic_block_store` |
| EFS | `mxgraph.aws4.elastic_file_system` |
| FSx | `mxgraph.aws4.fsx` |
| Storage Gateway | `mxgraph.aws4.storage_gateway` |
| Backup | `mxgraph.aws4.backup` |

### Database（データベース）- ブルー系
fillColor: `#2E73B8` / gradientColor: `#5294CF`

| サービス | resIcon値 |
|---------|----------|
| RDS | `mxgraph.aws4.rds` |
| DynamoDB | `mxgraph.aws4.dynamodb` |
| Aurora | `mxgraph.aws4.aurora` |
| ElastiCache | `mxgraph.aws4.elasticache` |
| Redshift | `mxgraph.aws4.redshift` |
| DocumentDB | `mxgraph.aws4.documentdb` |
| Neptune | `mxgraph.aws4.neptune` |

### Networking（ネットワーキング）- パープル系
fillColor: `#8C4FFF` / gradientColor: `#A166FF`

| サービス | resIcon値 |
|---------|----------|
| VPC | `mxgraph.aws4.vpc` |
| CloudFront | `mxgraph.aws4.cloudfront` |
| Route 53 | `mxgraph.aws4.route_53` |
| API Gateway | `mxgraph.aws4.api_gateway` |
| Direct Connect | `mxgraph.aws4.direct_connect` |
| ELB/ALB | `mxgraph.aws4.elastic_load_balancing` |
| Global Accelerator | `mxgraph.aws4.global_accelerator` |

### Security（セキュリティ）- レッド系
fillColor: `#DD344C` / gradientColor: `#FF5A5A`

| サービス | resIcon値 |
|---------|----------|
| IAM | `mxgraph.aws4.iam` |
| Cognito | `mxgraph.aws4.cognito` |
| Secrets Manager | `mxgraph.aws4.secrets_manager` |
| KMS | `mxgraph.aws4.key_management_service` |
| WAF | `mxgraph.aws4.waf` |
| Shield | `mxgraph.aws4.shield` |
| GuardDuty | `mxgraph.aws4.guardduty` |
| Certificate Manager | `mxgraph.aws4.certificate_manager` |

### Application Integration（アプリ統合）- ピンク系
fillColor: `#BC1356` / gradientColor: `#E34C8A`

| サービス | resIcon値 |
|---------|----------|
| SNS | `mxgraph.aws4.sns` |
| SQS | `mxgraph.aws4.sqs` |
| Step Functions | `mxgraph.aws4.step_functions` |
| EventBridge | `mxgraph.aws4.eventbridge` |
| AppSync | `mxgraph.aws4.appsync` |

### Analytics（分析）- オレンジ/ブラウン系
fillColor: `#945DF2` / gradientColor: `#B088F5`

| サービス | resIcon値 |
|---------|----------|
| Athena | `mxgraph.aws4.athena` |
| Kinesis | `mxgraph.aws4.kinesis` |
| EMR | `mxgraph.aws4.emr` |
| QuickSight | `mxgraph.aws4.quicksight` |
| Glue | `mxgraph.aws4.glue` |
| OpenSearch | `mxgraph.aws4.opensearch_service` |

### Machine Learning（機械学習）- グリーン系
fillColor: `#01A88D` / gradientColor: `#60D6C1`

| サービス | resIcon値 |
|---------|----------|
| SageMaker | `mxgraph.aws4.sagemaker` |
| Rekognition | `mxgraph.aws4.rekognition` |
| Comprehend | `mxgraph.aws4.comprehend` |
| Lex | `mxgraph.aws4.lex` |
| Polly | `mxgraph.aws4.polly` |
| Bedrock | `mxgraph.aws4.bedrock` |

### Management & Governance（管理）- ピンク系
fillColor: `#E7157B` / gradientColor: `#FF6FA8`

| サービス | resIcon値 |
|---------|----------|
| CloudWatch | `mxgraph.aws4.cloudwatch` |
| CloudFormation | `mxgraph.aws4.cloudformation` |
| CloudTrail | `mxgraph.aws4.cloudtrail` |
| Systems Manager | `mxgraph.aws4.systems_manager` |
| Config | `mxgraph.aws4.config` |

### Developer Tools（開発者ツール）- ブルー系
fillColor: `#2E7D32` / gradientColor: `#60A337`

| サービス | resIcon値 |
|---------|----------|
| CodePipeline | `mxgraph.aws4.codepipeline` |
| CodeBuild | `mxgraph.aws4.codebuild` |
| CodeDeploy | `mxgraph.aws4.codedeploy` |
| CodeCommit | `mxgraph.aws4.codecommit` |

### Containers（コンテナ）- オレンジ系
fillColor: `#D05C17` / gradientColor: `#F78E04`

| サービス | resIcon値 |
|---------|----------|
| ECR | `mxgraph.aws4.ecr` |
| ECS Anywhere | `mxgraph.aws4.ecs_anywhere` |
| App Runner | `mxgraph.aws4.app_runner` |

---

## グループ（枠）

### AWS Cloud（AWSクラウド全体）
```xml
<mxCell id="aws_cloud" value="AWS Cloud" style="points=[[0,0],[0.25,0],[0.5,0],[0.75,0],[1,0],[1,0.25],[1,0.5],[1,0.75],[1,1],[0.75,1],[0.5,1],[0.25,1],[0,1],[0,0.75],[0,0.5],[0,0.25]];outlineConnect=0;gradientColor=none;html=1;whiteSpace=wrap;fontSize=12;fontStyle=0;container=1;pointerEvents=0;collapsible=0;recursiveResize=0;shape=mxgraph.aws4.group;grIcon=mxgraph.aws4.group_aws_cloud_alt;strokeColor=#232F3E;fillColor=none;verticalAlign=top;align=left;spacingLeft=30;fontColor=#232F3E;dashed=0;" vertex="1" parent="1">
  <mxGeometry x="40" y="40" width="600" height="400" as="geometry"/>
</mxCell>
```

### VPC
```xml
<mxCell id="vpc" value="VPC" style="points=[[0,0],[0.25,0],[0.5,0],[0.75,0],[1,0],[1,0.25],[1,0.5],[1,0.75],[1,1],[0.75,1],[0.5,1],[0.25,1],[0,1],[0,0.75],[0,0.5],[0,0.25]];outlineConnect=0;gradientColor=none;html=1;whiteSpace=wrap;fontSize=12;fontStyle=0;container=1;pointerEvents=0;collapsible=0;recursiveResize=0;shape=mxgraph.aws4.group;grIcon=mxgraph.aws4.group_vpc2;strokeColor=#8C4FFF;fillColor=none;verticalAlign=top;align=left;spacingLeft=30;fontColor=#8C4FFF;dashed=0;" vertex="1" parent="1">
  <mxGeometry x="80" y="80" width="500" height="300" as="geometry"/>
</mxCell>
```

### Public Subnet
```xml
<mxCell id="public_subnet" value="Public subnet" style="points=[[0,0],[0.25,0],[0.5,0],[0.75,0],[1,0],[1,0.25],[1,0.5],[1,0.75],[1,1],[0.75,1],[0.5,1],[0.25,1],[0,1],[0,0.75],[0,0.5],[0,0.25]];outlineConnect=0;gradientColor=none;html=1;whiteSpace=wrap;fontSize=12;fontStyle=0;container=1;pointerEvents=0;collapsible=0;recursiveResize=0;shape=mxgraph.aws4.group;grIcon=mxgraph.aws4.group_security_group;grStroke=0;strokeColor=#7AA116;fillColor=#F2F6E8;verticalAlign=top;align=left;spacingLeft=30;fontColor=#248814;dashed=0;" vertex="1" parent="1">
  <mxGeometry x="100" y="120" width="180" height="200" as="geometry"/>
</mxCell>
```

### Private Subnet
```xml
<mxCell id="private_subnet" value="Private subnet" style="points=[[0,0],[0.25,0],[0.5,0],[0.75,0],[1,0],[1,0.25],[1,0.5],[1,0.75],[1,1],[0.75,1],[0.5,1],[0.25,1],[0,1],[0,0.75],[0,0.5],[0,0.25]];outlineConnect=0;gradientColor=none;html=1;whiteSpace=wrap;fontSize=12;fontStyle=0;container=1;pointerEvents=0;collapsible=0;recursiveResize=0;shape=mxgraph.aws4.group;grIcon=mxgraph.aws4.group_security_group;grStroke=0;strokeColor=#00A4A6;fillColor=#E6F6F7;verticalAlign=top;align=left;spacingLeft=30;fontColor=#147EBA;dashed=0;" vertex="1" parent="1">
  <mxGeometry x="320" y="120" width="180" height="200" as="geometry"/>
</mxCell>
```

### Availability Zone
```xml
<mxCell id="az" value="Availability Zone" style="fillColor=none;strokeColor=#147EBA;dashed=1;verticalAlign=top;fontStyle=0;fontColor=#147EBA;whiteSpace=wrap;html=1;" vertex="1" parent="1">
  <mxGeometry x="90" y="100" width="420" height="240" as="geometry"/>
</mxCell>
```

### Security Group
```xml
<mxCell id="sg" value="Security group" style="fillColor=none;strokeColor=#DD3522;verticalAlign=top;fontStyle=0;fontColor=#DD3522;whiteSpace=wrap;html=1;" vertex="1" parent="1">
  <mxGeometry x="110" y="140" width="140" height="160" as="geometry"/>
</mxCell>
```

---

## 使用例

### Lambda + API Gateway + DynamoDB
```xml
<!-- API Gateway -->
<mxCell id="apigw" value="API Gateway" style="shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.api_gateway;fillColor=#8C4FFF;strokeColor=#ffffff;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;aspect=fixed;" vertex="1" parent="1">
  <mxGeometry x="100" y="150" width="78" height="78" as="geometry"/>
</mxCell>

<!-- Lambda -->
<mxCell id="lambda" value="Lambda" style="shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.lambda;fillColor=#D05C17;strokeColor=#ffffff;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;aspect=fixed;" vertex="1" parent="1">
  <mxGeometry x="280" y="150" width="78" height="78" as="geometry"/>
</mxCell>

<!-- DynamoDB -->
<mxCell id="dynamodb" value="DynamoDB" style="shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.dynamodb;fillColor=#2E73B8;strokeColor=#ffffff;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;aspect=fixed;" vertex="1" parent="1">
  <mxGeometry x="460" y="150" width="78" height="78" as="geometry"/>
</mxCell>

<!-- データフロー -->
<mxCell id="flow1" style="edgeStyle=orthogonalEdgeStyle;html=1;endArrow=classic;" edge="1" parent="1" source="apigw" target="lambda">
  <mxGeometry relative="1" as="geometry"/>
</mxCell>
<mxCell id="flow2" style="edgeStyle=orthogonalEdgeStyle;html=1;endArrow=classic;" edge="1" parent="1" source="lambda" target="dynamodb">
  <mxGeometry relative="1" as="geometry"/>
</mxCell>
```
