using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ServerApp.Models;
using System.Linq;

namespace ServerApp.Controllers
{
    [Route("api/products")]
    [ApiController]
    public class ProductValuesController : Controller
    {
        private DataContext context;

        public ProductValuesController(DataContext ctx)
        {
            context = ctx;
        }

        [HttpGet("{id}")]
        public Product GetProduct(long id)
        {
            //System.Threading.Thread.Sleep(5000);
            //DbContext.Find(type, Object[])
            // return context.Products.Find(id);
            //Find replaced by FirstOrDefault
           Product result = context.Products.Include(p => p.Supplier).ThenInclude(s => s.Products).Include(p => p.Ratings).FirstOrDefault(p => p.ProductId == id);

            if(result != null)
            {
                if(result.Supplier != null)
                {
                    result.Supplier.Products = null;
                }
                if(result.Ratings != null )
                {
                    foreach(Rating r in result.Ratings)
                    {
                        r.Product = null;
                    }
                }
            }
            return result;
        }
    }
}

//{
//  "productId": 2,
//  "name": "Lifejacket",
//  "category": "Watersports",
//  "description": "Protective and fashionable",
//  "price": 48.95,
//  "supplier": {
//    "supplierId": 1,
//    "name": "Splash Dudes",
//    "city": "San Jose",
//    "state": "CA",
//    "products": null
//  },
//  "ratings": [
//    {
//      "ratingId": 3,
//      "stars": 2,
//      "product": null
//    },
//    {
//      "ratingId": 4,
//      "stars": 5,
//      "product": null
//    }
//  ]
//}
