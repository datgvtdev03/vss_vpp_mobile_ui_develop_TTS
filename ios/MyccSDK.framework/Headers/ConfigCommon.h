//
//  ConfigCommon.h
//  Patient
//
//  Created by admin on 11/20/20.
//  Copyright © 2020 Hà Tiến Dũng. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <AudioToolbox/AudioToolbox.h>

NS_ASSUME_NONNULL_BEGIN

typedef struct _LinphoneManagerSounds {
    SystemSoundID vibrate;
} LinphoneManagerSounds;


@interface ConfigCommon : NSObject
@property (readonly) LinphoneManagerSounds sounds;
@end

NS_ASSUME_NONNULL_END
