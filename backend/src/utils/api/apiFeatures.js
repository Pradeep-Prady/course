class APIFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    if (this.queryStr.keyword) {
      this.query = this.query.find({
        status: {
          $regex: this.queryStr.keyword,
          $options: "i",
        },
      });
    }
    return this;
  }

  // sortWithDate() {
  //   if (this.queryStr.from && this.queryStr.to) {
  //     const fromParts = this.queryStr.from.split("-");
  //     const fromDate = new Date(fromParts[0], fromParts[1] - 1, fromParts[2]);

  //     const toParts = this.queryStr.to.split("-");
  //     const toDate = new Date(toParts[0], toParts[1] - 1, toParts[2]);

  //     // Adjust toDate to include the entire day by setting the time to the end of the day
  //     toDate.setHours(23, 59, 59, 999);

  //     // Construct query to match orders within the date range
  //     this.query = this.query.find({
  //       createdAt: {
  //         $gte: fromDate,
  //         $lte: toDate,
  //       },
  //     });
  //   }

  //   // Sort orders by createdAt field in descending order
  //   this.query = this.query.sort({ createdAt: -1 });

  //   return this;
  // }
  sortWithDate() {
    if (this.queryStr.from && this.queryStr.to) {
      const fromDate = this.queryStr.from;
      const toDate = this.queryStr.to;
  
      // Construct query to match orders within the date range
      this.query = this.query.find({
        $expr: {
          $and: [
            {
              $gte: [
                { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                fromDate,
              ],
            },
            {
              $lte: [
                { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                toDate,
              ],
            },
          ],
        },
      });
    } else if (this.queryStr.from) {
      const fromDate = this.queryStr.from;
  
      // If only 'from' date is provided, get all orders from that date onwards
      this.query = this.query.find({
        $expr: {
          $gte: [
            { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            fromDate,
          ],
        },
      });
    } else if (this.queryStr.to) {
      const toDate = this.queryStr.to;
  
      // If only 'to' date is provided, get all orders up to the end of that date
      this.query = this.query.find({
        $expr: {
          $lte: [
            { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            toDate,
          ],
        },
      });
    }
  
    // Sort orders by createdAt field in descending order
    this.query = this.query.sort({ createdAt: -1 });
  
    return this;
  }
  
  
  
  filter() {
    const queryStrCopy = { ...this.queryStr };
    const removeFields = ["keyword", "limit", "page"];
    removeFields.forEach((field) => delete queryStrCopy[field]);

    let queryStr = JSON.stringify(queryStrCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  paginate(resPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resPerPage * (currentPage - 1);
    this.query = this.query.limit(resPerPage).skip(skip);
    return this;
  }
}

export default APIFeatures;
``