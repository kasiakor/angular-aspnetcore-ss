﻿using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ServerApp.Models;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Authorization;

namespace ServerApp.Controllers
{

    [Route("/api/orders")]
    [Authorize(Roles = "Administrator")]
    [ApiController]
    public class OrderValuesController : Controller
    {
        private DataContext context;

        public OrderValuesController(DataContext ctx)
        {
            context = ctx;
        }

        [HttpGet]
        public IEnumerable<Order> GetOrders()
        {
            return context.Orders
                .Include(o => o.Products).Include(o => o.Payment);
        }

        [HttpPost("{id}")]
        public void MarkShipped(long id)
        {
            Order order = context.Orders.Find(id);
            if (order != null)
            {
                order.Shipped = true;
                context.SaveChanges();
            }
        }

        [HttpPost]
        [AllowAnonymous]
        public IActionResult CreateOrder([FromBody] Order order)
        {
            if (ModelState.IsValid)
            {

                order.OrderId = 0;
                order.Shipped = false;
                order.Payment.Total = GetPrice(order.Products);

                ProcessPayment(order.Payment);
                if (order.Payment.AuthCode != null)
                {
                    context.Add(order);
                    context.SaveChanges();
                    return Ok(new
                    {
                        orderId = order.OrderId,
                        authCode = order.Payment.AuthCode,
                        amount = order.Payment.Total
                    });
                }
                else
                {
                    return BadRequest("Payment rejected");
                }
            }
            return BadRequest(ModelState);
        }
        //the method queries db to get the price for products, does not trust the user
        private decimal GetPrice(IEnumerable<CartLine> lines)
        {
            IEnumerable<long> ids = lines.Select(l => l.ProductId);
            IEnumerable<Product> prods
                = context.Products.Where(p => ids.Contains(p.ProductId));
            return prods.Select(p => lines
                    .First(l => l.ProductId == p.ProductId).Quantity * p.Price)
                .Sum();
        }

        private void ProcessPayment(Payment payment)
        {
            // integrate your payment system here
            payment.AuthCode = "12345";
        }
    }
}

///api/orders = [
//   {
//      "orderId":1,
//      "name":"Ewa Zak",
//      "products":[
//         {
//            "cartLineId":1,
//            "productId":1,
//            "quantity":1
//         }
//      ],
//      "address":"Flower Street",
//      "payment":{
//         "paymentId":1,
//         "cardNumber":"080808080808080",
//         "cardExpiry":"pkg;ks;kfd",
//         "cardSecurityCode":"lm;k;",
//         "total":275.00,
//         "authCode":"12345"
//      },
//      "shipped":false
//   },
//   {
//      "orderId":2,
//      "name":"Ewa Zak",
//      "products":[
//         {
//            "cartLineId":2,
//            "productId":3,
//            "quantity":1
//         }
//      ],
//      "address":"Flower Street",
//      "payment":{
//         "paymentId":2,
//         "cardNumber":"ljsfkk;;ak;fsk",
//         "cardExpiry":".lmljlj",
//         "cardSecurityCode":";k;k;k",
//         "total":19.50,
//         "authCode":"12345"
//      },
//      "shipped":false
//   },