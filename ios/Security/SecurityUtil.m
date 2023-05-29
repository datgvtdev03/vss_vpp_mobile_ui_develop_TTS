//
//  SecurityUtil.m
//  vpp
//
//  Created by MINH NGOC on 25/11/2021.
//
#import <React/RCTBridgeModule.h>
#import <Foundation/Foundation.h>

@interface RCT_EXTERN_MODULE(SecurityUtil, NSObject)

RCT_EXTERN_METHOD(encrypt:(id *)inputs resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(decrypt:(NSString *)inputs resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)

@end
