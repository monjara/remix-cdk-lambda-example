import * as path from 'node:path'
import * as cdk from 'aws-cdk-lib'
import { HttpApi } from 'aws-cdk-lib/aws-apigatewayv2'
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations'
import {
  Architecture,
  DockerImageCode,
  DockerImageFunction,
} from 'aws-cdk-lib/aws-lambda'
import type { Construct } from 'constructs'

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const remixFunction = new DockerImageFunction(this, 'RemixFunction', {
      code: DockerImageCode.fromImageAsset(
        path.join(__dirname, '..', '..', 'remix-app')
      ),
      functionName: 'RemixFunction',
      architecture: Architecture.ARM_64,
      memorySize: 256,
    })

    const httpApi = new HttpApi(this, 'HttpApi')
    const integration = new HttpLambdaIntegration(
      'LambdaIntegration',
      remixFunction
    )

    httpApi.addRoutes({
      path: '/{proxy+}',
      integration,
    })

    new cdk.CfnOutput(this, 'ApiEndpoint', { value: httpApi.apiEndpoint })
  }
}
