import * as cdk from 'aws-cdk-lib'
import { Template } from 'aws-cdk-lib/assertions'
import * as Cdk from '../lib/cdk-stack'

describe('Stack test', () => {
  let template: Template
  beforeAll(() => {
    const app = new cdk.App()
    const stack = new Cdk.CdkStack(app, 'MyTestStack')
    template = Template.fromStack(stack)
  })
  test('Lambda', () => {
    template.hasResourceProperties('AWS::Lambda::Function', {
      FunctionName: 'RemixFunction',
      PackageType: 'Image',
      MemorySize: 256,
      Architectures: ['arm64'],
    })
  })
  test('HttpApi', () => {
    template.hasResourceProperties('AWS::ApiGatewayV2::Api', {
      Name: 'HttpApi',
    })
  })
  test('Integration', () => {
    template.hasResourceProperties('AWS::ApiGatewayV2::Integration', {
      IntegrationType: 'AWS_PROXY',
    })
  })
  test('Route', () => {
    template.hasResourceProperties('AWS::ApiGatewayV2::Route', {
      RouteKey: 'ANY /{proxy+}',
    })
  })
})
