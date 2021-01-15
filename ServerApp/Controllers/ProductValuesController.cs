using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ServerApp.Models;
using ServerApp.Models.BindingTargets;
using System.Collections.Generic;
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

            if (result != null)
            {
                if (result.Supplier != null)
                {
                    //result.Supplier.Products = null;
                    result.Supplier.Products = result.Supplier.Products.Select(p =>
                    new Product
                    {
                        ProductId = p.ProductId,
                        Name = p.Name,
                        Category = p.Category,
                        Description = p.Description,
                        Price = p.Price
                    });
                }
                if (result.Ratings != null)
                {
                    foreach (Rating r in result.Ratings)
                    {
                        r.Product = null;
                    }
                }
            }
            return result;
        }
        [HttpGet]
        public IEnumerable<Product> GetProducts(string category, string search, bool related = false)
        {
            IQueryable<Product> query = context.Products;

            if(!string.IsNullOrEmpty(category))
            {
                string categoryLower = category.ToLower();
                query = query.Where(p => p.Category.ToLower().Contains(categoryLower));
            }

            if (!string.IsNullOrEmpty(search))
            {
                string searchLower = search.ToLower();
                query = query.Where(p => p.Name.ToLower().Contains(searchLower) ||p.Description.ToLower().Contains(searchLower));
            }
            if (related)
            {
                query = query.Include(p => p.Supplier).Include(p => p.Ratings);
                List<Product> data = query.ToList();
                data.ForEach(p => {
                    if (p.Supplier != null)
                    {
                        p.Supplier.Products = null;
                    }
                    if (p.Ratings != null)
                    {
                        p.Ratings.ForEach(r => r.Product = null);
                    }
                });
                return data;
            }
            else
            {
                return query;
            }
        }

        [HttpPost]
        public IActionResult CreateProduct([FromBody] ProductData pdata)
        {
            if (ModelState.IsValid)
            {
                Product p = pdata.Product;
                if (p.Supplier != null && p.Supplier.SupplierId != 0)
                {
                    context.Attach(p.Supplier);
                }
                context.Add(p);
                context.SaveChanges();
                return Ok(p.ProductId);
            }
            else
            {
                return BadRequest(ModelState);
            }
        }

        [HttpPut("{id}")]
        public IActionResult ReplaceProduct(long id, [FromBody] ProductData pdata)
        {
            if (ModelState.IsValid)
            {
                Product p = pdata.Product;
                p.ProductId = id;
                if (p.Supplier != null && p.Supplier.SupplierId != 0)
                {
                    context.Attach(p.Supplier);
                }
                context.Update(p);
                context.SaveChanges();
                return Ok();
            }
            else
            {
                return BadRequest(ModelState);
            }
        }

        [HttpPatch("{id}")]
        public IActionResult UpdateProduct(long id,
                [FromBody]JsonPatchDocument<ProductData> patch)
        {

            Product product = context.Products
                                .Include(p => p.Supplier)
                                .First(p => p.ProductId == id);
            ProductData pdata = new ProductData { Product = product };

            patch.ApplyTo(pdata, ModelState);

            if (ModelState.IsValid && TryValidateModel(pdata))
            {

                if (product.Supplier != null && product.Supplier.SupplierId != 0)
                {
                    context.Attach(product.Supplier);
                }
                context.SaveChanges();
                return Ok();
            }
            else
            {
                return BadRequest(ModelState);
            }
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

//additional related data
//{
//  "productId": 1,
//  "name": "Kayak",
//  "category": "Watersports",
//  "description": "A boat for one person",
//  "price": 275,
//  "supplier": {
//    "supplierId": 1,
//    "name": "Splash Dudes",
//    "city": "San Jose",
//    "state": "CA",
//    "products": [
//      {
//        "productId": 1,
//        "name": "Kayak",
//        "category": "Watersports",
//        "description": "A boat for one person",
//        "price": 275,
//        "supplier": null,
//        "ratings": null
//      },
//      {
//        "productId": 2,
//        "name": "Lifejacket",
//        "category": "Watersports",
//        "description": "Protective and fashionable",
//        "price": 48.95,
//        "supplier": null,
//        "ratings": null
//      }
//    ]
//  },
//  "ratings": [
//    {
//      "ratingId": 1,
//      "stars": 4,
//      "product": null
//    },
//    {
//      "ratingId": 2,
//      "stars": 3,
//      "product": null
//    }
//  ]
//}
