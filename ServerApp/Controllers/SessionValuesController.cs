using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using ServerApp.Models;
using ServerApp.Models.BindingTargets;
using System;

namespace ServerApp.Controllers
{
    [Route("api/session")]
    [ApiController]
    public class SessionValuesController : Controller
    {

        [HttpGet("cart")]
        public IActionResult GetCart()
        {
            return Ok(HttpContext.Session.GetString("cart"));
        }

        [HttpPost("cart")]
        public void StoreCart([FromBody] CartProductSelection[] products)
        {
            var jsonData = JsonConvert.SerializeObject(products);
            HttpContext.Session.SetString("cart", jsonData);
        }

        [HttpGet("checkout")]
        public IActionResult GetCheckout()
        {
            //receives serialized data and returns it to the client
            //getString reads data
            //HttpContext.Session gives access to data
            return Ok(HttpContext.Session.GetString("checkout"));
        }

        [HttpPost("checkout")]
        public void StoreCheckout([FromBody] CheckoutState data)
        {
            Console.WriteLine(data);
            //mvc model binder will read the data from body
            //data is received as json from the client then parsed to create .net object
            //then data is serialized as json again
            var jsonData = JsonConvert.SerializeObject(data);
            HttpContext.Session.SetString("checkout", jsonData);
            //response: { "name":"Ewa Zak","address":"Flower Street","cardNumber":"grgggh","cardExpiry":"gggggg","cardSecurityCode":"t4ttt"}
        }
    }
}
