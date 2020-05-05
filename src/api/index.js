const restify = require("restify");
const params = require('minimist')(process.argv.slice(2));
const puppeteer = require('puppeteer');
const fs = require('fs');
const mkdirp = require('mkdirp');
const getDirName = require('path').dirname;
var recursive = require("recursive-readdir");


// Create server
let server = restify.createServer();
server.use(restify.plugins.queryParser());
server.listen(process.env.port || process.env.PORT || 3001, function() {
  console.dir(`${server.name} listening to ${server.url}`);
});

async function getTemplate(req, res, next) {

  // Get active template
  let templates = fs.readdirSync('templates');
  let activeTemplate;
  templates.forEach((template) => {
    template = template.replace('.js', '');
    if (template === req.params.template) {
      activeTemplate = template;
    }
  })

  // If template not defined, skip
  if (activeTemplate === undefined) {
    return next();
  }

  // Convert query string to Base64, this means a new image will be created for each variation in parameter
  let id = Buffer.from(JSON.stringify(req.query)).toString('base64');

  // Convert query object to string
  let query = Object.keys(req.query).map(key => key + '=' + encodeURIComponent(req.query[key])).join('&');

  // See if image already exists
  let exists = false;
  let path = `assets/${activeTemplate}/${id}.png`;
  if (fs.existsSync(path)) {
    exists = true;
  } else {
    exists = false;
  }

  // Get config options from template file
  templateConfig = require(`../../templates/${activeTemplate}`).templateConfig();

  // Set the response header to png
  res.writeHead(200, {
    'Content-Type': 'image/png'
  });

  // Serve file
  let response = 'default response';
  if (!exists) {
    // Take screenshot of template and return base64
    let responseB64 = await getScreenshot(`${server.url}/preview/${activeTemplate}?${query}`, templateConfig.width, templateConfig.height);

    // Create image file from base64
    let responseImg = await createFile(responseB64, path, (err) => { (err) ? console.log(err) : ''});

    // Remove files if too many
    const totalFileCount = 2000;
    await recursive("assets", function (err, files) {
      let fileCount = files.length;
      if (fileCount > totalFileCount) {
        let fileList = [];
        files.forEach((file) => {
          let time = fs.statSync(file).birthtimeMs;
          fileList.push({file, time});
        })
        fileList.sort(function (a, b) {
          return a.time - b.time;
        });

        // Remove oldest file 
        fs.unlink(fileList[0].file, (err) => {
          if (err) throw err;
        });
      }
    });

    // Return image from base64
    response = await new Buffer(responseB64, 'base64');
  } else {
    // Return image from file
    response = fs.readFileSync(path);
  }

  // Send response
  res.end(response);
  return next();
}


function getPreview(req, res, next) {
  // Get active template
  let templates = fs.readdirSync('templates');
  let activeTemplate;
  templates.forEach((template) => {
    template = template.replace('.js', '');
    if (template === req.params.template) {
      activeTemplate = template;
    }
  })

  // If template not defined, skip
  if (activeTemplate === undefined) {
    return next();
  }

  // Get template file
  activeTemplate = require(`../../templates/${activeTemplate}`);

  // Get html from template
  let response = activeTemplate.templateHtml(req.query);

  // Set response header to html
  res.writeHead(200, {
    'Content-Type': 'text/html;charset=utf-8'
  });

  // Send response
  res.end(response);
  return next();
}

function getIndex(req, res, next) {
  // Set index response for server
  res.send('After Lockdown Thumbnails');

  return next();
}

const getScreenshot = async (url, width, height) => {
  try {
    // Launch browser
    const browser = await puppeteer.launch({ headless: true });

    // Open new tab
    const page = await browser.newPage();

    // Set page width and height
    await page.setViewport({width: width, height: height, deviceScaleFactor: 2});

    // Go to preview url
    await page.goto(url);

    // Take screenshot of page and convert to base64
    const b64string = await page.screenshot({ encoding: "base64" });

    // Close browser
    await browser.close();

    // Return base64 string
    return await b64string;
  } catch(error) {
    // Log any errors
    console.dir(error);
  }
}

const createFile = async (b64, path, cb) => {
  // If directory doesn't exist, generate it
  mkdirp(getDirName(path), function (err) {
    if (err) return cb(err);
    
    // Write file to path from base64
    fs.writeFile(path, b64, 'base64', cb);
  });
}

// Show index page
server.get('/', getIndex)

// Serve image asset
server.get('/assets/:template', getTemplate);

// Preview template
server.get('/preview/:template', getPreview);