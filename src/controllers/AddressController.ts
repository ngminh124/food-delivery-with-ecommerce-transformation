import Address from "../models/Address";

export class AddressController {
  static async addAddress(req, res, next) {
    const data = req.body;
    const user_id = req.user.aud;
    try {
      const addressData = {
        user_id: user_id,
        title: data.title,
        address: data.address,
        landmark: data.landmark,
        house: data.house,
        lat: data.lat,
        lng: data.lng,
      };
      const address = await new Address(addressData).save();
    //   delete address.user_id;
    const reponseAddress = {
        _id: address._id,
        title: address.title,
        address: address.address,
        landmark: address.landmark,
        house: address.house,
        lat: address.lat,
        lng: address.lng,
        created_at: address.created_at,
        updated_at: address.updated_at,
    }
      res.send(reponseAddress);
    } catch (e) {
      next(e);
    }
  }

  static async getUserAddresses(req, res, next) {
    const user_id = req.user.aud;
    const perPage = 5;
    const currentPage = parseInt(req.query.page) || 1;
    const prevPage = currentPage == 1 ? null : currentPage - 1;
    let nextPage = currentPage + 1;
    try {
      const address_doc_count = await Address.countDocuments({ user_id });
      const totalPages = Math.ceil(address_doc_count / perPage); // 5.05 => 6
      if(totalPages == 0 || totalPages == currentPage) {
        nextPage = null;
      }
      if(totalPages < currentPage) {
        // throw new Error('No more addresses available.');
        throw ('No more addresses available.');
      }
      const addresses = await Address.find({ user_id }, { __v: 0, user_id: 0 })
                                    .skip((currentPage * perPage)-perPage) // 7 documents, (page 1 - 5), (page 2 - 1)
                                    .limit(perPage);
      // res.send(addresses);
      res.json({
        addresses: addresses,
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

  static async getLimitedUserAddresses(req, res, next) {
    const user_id = req.user.aud;
    const limit = req.query.limit
    try {
      const addresses = await Address.find({ user_id }, { __v: 0, user_id: 0 }).limit(limit);
      res.send(addresses);
    } catch (e) {
      next(e);
    }
  }

  static async deleteAddress(req, res, next) {
    const user_id = req.user.aud;
    const id = req.params.id; // Đổi từ address_id thành id
    try {
      await Address.findOneAndDelete({
        user_id,
        _id: id,
      });
      res.send({ success: true });
    } catch (e) {
      next(e);
    }
  }

  static async getAddressById(req, res, next) {
    const user_id = req.user.aud;
    const id = req.params.id;
    try {
      const address = await Address.findOne({
        user_id,
        _id: id,
      },
      { __v: 0, user_id: 0 });
      res.send(address);
    } catch (e) {
      next(e);
    }
  }

  static async editAddress(req, res, next) {
    const user_id = req.user.aud;
    const id = req.params.id;
    const data = req.body;
    try {
      const editedAddress = await Address.findOneAndUpdate(
        {
          user_id,
          _id: id,
        },
        {
          title: data.title,
          address: data.address,
          landmark: data.landmark,
          house: data.house,
          lat: data.lat,
          lng: data.lng,
          updated_at: new Date(),
        },
        { new: true, projection: { __v: 0, user_id: 0 } }
      );
      if(editedAddress) res.send(editedAddress);
      else throw new Error('Address does not exist.');
    } catch (e) {
      next(e);
    }
  }

    static async checkAddress(req, res, next) {
    const user_id = req.user.aud;
    const data = req.query ;
    try {
      const address = await Address.findOne(
        { user_id, lat: data.lat, lng: data.lng }, 
        { __v: 0, user_id: 0 });
      res.send(address);
    } catch (e) {
      next(e);
    }
  }
}
