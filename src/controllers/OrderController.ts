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
      const perPage = 1;
      const currentPage = parseInt(req.query.page) || 1;
      const prevPage = currentPage == 1 ? null : currentPage - 1;
      let nextPage = currentPage + 1;
      try {
        const order_doc_count = await Order.countDocuments({ user_id });
        const totalPages = Math.ceil(order_doc_count / perPage); // 5.05 => 6
        if (totalPages == 0 || totalPages == currentPage) {
          nextPage = null;
        }
        if (totalPages < currentPage) {
          // throw new Error('No more orders available.');
          throw "No more orders available.";
        }
        const orders = await Order.find({ user_id }, { __v: 0, user_id: 0 })
        .skip((currentPage * perPage) - perPage) // 7 documents, (page 1 - 5), (page 2 - 1)
        .limit(perPage)
        .sort(
          { created_at: 1 }
        )
        .populate('restaurant_id')
        .exec();
        // res.send(orders);
        res.json({
        orders,
        perPage,
        currentPage,
        prevPage,
        nextPage,
        totalPages
      })
      } catch (e) {
        next(e);
      }
    }
  }
