#import <UIKit/UIKit.h>
#import <React/RCTView.h>
#import <React/RCTBridgeModule.h>

@interface LaserPrinter : RCTView <RCTBridgeModule, UIPrintInteractionControllerDelegate, UIPrinterPickerControllerDelegate>
@property UIPrinter *pickedPrinter;
@property NSString *filePath;
@property NSString *htmlString;
@property NSURL *printerURL;
@property (nonatomic, assign) BOOL isLandscape;
@end
