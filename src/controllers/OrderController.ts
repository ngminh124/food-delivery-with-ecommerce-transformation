import Order from "../models/Order";

export class OrderController {
  static async placeOrder(req, res, next) {
    const data = req.body;
    const user_id = req.user.aud;
    const restaurant = req.restaurant;
    try {
      let orderData: any = {
        user_id: user_id,
        restaurant_id: data.restaurant_id,
        order: data.order,
        address: data.address,
        status: data.status,
        payment_status: data.payment_status,
        payment_mode: data.payment_mode,
        total: data.total,
        grandTotal: data.grandTotal,
        deliveryCharge: data.deliveryCharge,
      };
      if (data.instruction)
        orderData = { ...orderData, instruction: data.instruction };
      const order = await new Order(orderData).save();
      //   const address = await new Order(addressData).save();
      // //   delete address.user_id;
      const reponseOrder = {
        restaurant_id: restaurant,
        address: order.address,
        order: JSON.parse(order.order),
        status: order.status,
        payment_status: order.payment_status,
        payment_mode: order.payment_mode,
        total: order.total,
        grandTotal: order.grandTotal,
        deliveryCharge: order.deliveryCharge,
        instruction: order.instruction,
        created_at: order.created_at,
        updated_at: order.updated_at,
      };
      res.send(reponseOrder);
    } catch (e) {
      next(e);
    }
  }
  static async getUserOrders(req, res, next) {
    const user_id = req.user.aud;
    try{
        const orders = await Order.find({user_id}, {__v:0, user_id:0})
        .sort({created_at: 1})
        // .populate('restaurant_id').exec();
        res.send(orders);
    } catch (e) {
        next(e);
    }
}
}
