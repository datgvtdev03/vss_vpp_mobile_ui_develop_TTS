#import <UIKit/UIKit.h>
#import <React/RCTLog.h>
#import "LoadingNative.h"
#import "SVProgressHUD.h"

@implementation LoadingNative

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(showLoading)
{
  [SVProgressHUD setBackgroundColor:UIColor.clearColor];
  [SVProgressHUD setRingThickness:3];
  [SVProgressHUD setForegroundColor:[UIColor colorWithRed:255.0 green:255.0 blue:255.0 alpha:1]];
  [SVProgressHUD setDefaultMaskType:SVProgressHUDMaskTypeBlack];
  [SVProgressHUD show];
}

RCT_EXPORT_METHOD(hideLoading)
{
  [SVProgressHUD dismiss];
}

- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}

+ (BOOL)requiresMainQueueSetup
{
  return YES;
}

@end
