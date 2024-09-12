import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { OrderGood } from "./order.good.entity";


/**
 *  // "receiver_mobile": "13610590016",
 *  // "receiver_name": "西多士",
 *  // "prov_name": "广东省",
 *  // "city_name": "佛山市",
 *  // "area_name": "南海区",
 *  // "town_name": "狮山镇",
 *  // "address": "广东东软学院小镇菜鸟驿站",
 * 
 * 
 * 
 * 
 */
@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id: number;  // 主键



    // 订单的价格
    @Column({default: 0})
    total_amount: number;

    // 订单的状态
    @Column({default: 0})
    order_status: number;

    // 订单的状态
    @Column({default: 0})
    order_no: string;

    // 订单的状态
    @Column({default: ''})
    user_name: string;

    // 订单的收货地址
    @Column({default: ''})
    address: string;

    // 订单的收货人
    @Column({default: ''})
    receiver_name: string;

    // 订单的收货人电话
    @Column({default: ''})
    receiver_mobile: string;

    // 订单的省份
    @Column({default: ''})
    prov_name: string;

    // 订单的城市
    @Column({default: ''})
    city_name: string;

      
    // 订单的区域
    @Column({default: ''})
    area_name: string;

    // 订单的镇
    @Column({default: ''})
    town_name: string;
    
    // 订单的镇
    @Column({default: ''})
    buyer_nick: string;

    // 订单的快递公司
    @Column({default: ''})
    expressCompany: string;

    // 订单的快递公司
    @Column({default: ''})
    waybill_no: string;

    // 订单的快递公司
    @Column({default: ''})
    express_name: string;


    // 订单的快递公司code
    @Column({default: ''})
    express_code: string;

    // 订单时间
    @Column()
    order_time: number;

    @UpdateDateColumn() // 更新时间
    updatedAt: Date;

    @OneToOne(() => OrderGood, { cascade: true })
    @JoinColumn()
    orderGood: OrderGood;

    
}
