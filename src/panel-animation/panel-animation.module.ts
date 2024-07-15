import { Global, Module } from '@nestjs/common';
import { PanelAnimationService } from './panel-animation.service';
import { PanelAnimationController } from './panel-animation.controller';
import { PanelAnimation } from './panel-animation.entity';
import { Panel } from './one-panel-animation.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

/**
 * 表示面板动画模块。
 */

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([ PanelAnimation, Panel])],
  controllers: [PanelAnimationController],
  providers: [PanelAnimationService],
  exports: [PanelAnimationService],
})
export class PanelAnimationModule {}
