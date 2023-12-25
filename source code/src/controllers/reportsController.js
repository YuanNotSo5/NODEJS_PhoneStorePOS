const invoiceService = require('../services/invoiceService.js');
const Invoice = require('../models/invoice.js');

class reportsController {
    //[GET]/report
    getReport = async (req, res) => {
        try {
            //Lấy ngày hiện tại
            const today = new Date();
            today.setUTCHours(0, 0, 0, 0);
            today.setUTCDate(today.getUTCDate() + 1); 
            //Chọn 7 ngày hiện tại
            const tomorrow = new Date(today);
            tomorrow.setUTCDate(today.getUTCDate() - 7); 

            const invoiceList = await invoiceService.findInvoicesForToday(tomorrow, today);

            //Lấy được các invoices trong những ngày trên
            if (invoiceList.status === 'success') {



                //Tổng số lượng tiền cho tất cả nhưng hóa đơn trong ngày này
                const totalAmountSum = invoiceList.invoices.reduce((acc, invoice) => {
                    return acc + invoice.totalAmount;
                }, 0);

                const totalRevenue = invoiceList.invoices.reduce((acc, invoice) => {
                    return acc + invoice.revenue;
                }, 0);
                //Sắp xếp các hóa đơn
                const sortedInvoices = invoiceList.invoices.sort((a, b) => a.date - b.date);
                const invoicesByDate = this.getInvoiceByDate(sortedInvoices);
                res.render("admin/chart", {
                    startDate: tomorrow,
                    endDate: today,
                    invoiceList: sortedInvoices,
                    totalAmountSum: totalAmountSum,
                    totalRevenue: totalRevenue,
                    groupedInvoices: invoicesByDate,
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    getInvoiceByDate(sortedInvoices){
        const invoicesByDate = {};
        let quantity = 0;
        let totalQuantity = 0;
        sortedInvoices.forEach(invoice => {
            let productsList = invoice.products;
            quantity = 0;
            const dateKey = invoice.date.toISOString().split('T')[0];
            if (!invoicesByDate[dateKey]) {
                quantity = 0;
                totalQuantity = 0;
                invoicesByDate[dateKey] = [];
            }
            productsList.forEach(item=>{
                quantity = quantity + item.quantity;
                totalQuantity = totalQuantity + item.quantity
            })
            invoicesByDate[dateKey].push(
                {
                    invoiceId: invoice._id,
                    quantity: quantity,
                    totalAmount: invoice.totalAmount,
                    revenue: invoice.revenue
                }
            );
        });
        return invoicesByDate;
    }

    getData = async (req, res) => {
        const today = new Date(req.body.startDate);
        const end = new Date(req.body.endDate);
        console.log('today', today);
        console.log('end', end);
    
        const invoiceList = await invoiceService.findInvoicesForToday(today, end);
        if (invoiceList.status === 'success') {
            const totalAmountSum = invoiceList.invoices.reduce((acc, invoice) => {
                return acc + invoice.totalAmount;
            }, 0);
            const revenueTotal = invoiceList.invoices.reduce((acc, invoice) => {
                return acc + invoice.revenue;
            }, 0);

            const sortedInvoices = invoiceList.invoices.sort((a, b) => a.date - b.date);
            const invoicesByDate = this.getInvoiceByDate(sortedInvoices);
            res.status(200).json({ 
                message: 'Success', 
                startDate: today,
                endDate: end,
                invoiceList: sortedInvoices,
                totalAmountSum: totalAmountSum,
                revenueTotal: revenueTotal,
                groupedInvoices: invoicesByDate,
            });
        }
    }
    
    
}
module.exports = new reportsController;