const express = require("express");
const urlModel = require("../models/urlModel");
const mongoose = require("mongoose");
const dns = require("dns");

// Search for '://,store protcol and hostname+path
var protocolRedExp = /^http?:\/\/(.*)/i;
// Search for patterns like xxxx.xxxx.xxx etc
var hostnameRegExp = /^([a-z0-9\-_]+\.)+[a-z0-9\-_]+/i;

exports.createUrl = (req, res, next) => {
  // console.log(req.body);
  console.log(req.body.url);
  urlModel
    .find({ path: req.body.path })
    .then(doc => {
      if (doc.length > 0) {
        res.status(406).json({ message: "Short url path already exist" });
      } else {
        let urlString = req.body.url;
        if (urlString.length > 0) {
          if (urlString.match(/\/$/i)) urlString = urlString.slice(0, -1);

          var protocolMatch = urlString.match(protocolRedExp);
          if (!protocolMatch) {
            return res.json({ error: "Invalid URL" });
          }

          var hostAndQuery = protocolMatch[1];

          // url w/out prtocol
          // DNS lookup: validate hostname
          var hostnameMatch = hostAndQuery.match(hostnameRegExp);
          if (hostnameMatch) {
            dns.lookup(hostnameMatch[0], function(err) {
              if (err) {
                res.json({ error: "Invalid Hostname" });
              } else {
                const url = new urlModel({
                  _id: new mongoose.Types.ObjectId(),
                  path: req.body.path,
                  long_url: req.body.url
                });
                console.log(url);
                url
                  .save()
                  .then(result =>
                    res.json({
                      original_url: url.long_url,
                      short_url: url.path
                    })
                  )
                  .catch(err => res.json({ message: "Failed" }));
              }
            });
          }
        }
      }
    })
    .catch(err => res.status(500));
};

exports.getLongUrl = (req, res, next) => {
  const shurl = req.params.shurl;
  console.log(shurl);
  urlModel
    .find({ path: shurl })
    .then(doc => {
      console.log(doc);
      if (doc.length > 0) {
        // res.json(doc);
        // res.redirect('doc.long_url');
        res.redirect(301, doc[0].long_url);
      } else {
        res.status(404).json({ error: "No short url found for the given url" });
      }
    })
    .catch(err => res.status(500).json({ message: "Something went wrong" }));
};
