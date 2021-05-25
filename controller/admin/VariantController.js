/**
 * =================================================================================
 * created by cbl-147
 * @description used for performing an variants of product related action from admin
 * =================================================================================
 */

var async = require('async');
var sendResponse = require('../../routes/sendResponse');
var constant = require('../../routes/constant');
var func = require('../../routes/commonfunction');
var consts=require('./../../config/const')
const lib=require('../../lib/NotificationMgr')
var _ = require('underscore');
var something = "Something went wrong";
var client = require('twilio')("AC4b6d9ecd84afd6db7cf9ac5f055d7784","782e67bf1f26170706acd639d757ae08");
var moment = require('moment');
var pushNotifications = require('../../routes/pushNotifications');
var orderFunction = require('../../routes/orderFunction');
var loginFunctions = require('../../routes/loginFunctions');
var AdminMail = "ops@royo.com";
var crypto = require('crypto')
const ExecuteQ=require('../../lib/Execute');

var log4js = require('log4js');
var logger = log4js.getLogger();
logger.level = config.get('server.debug_level');


    algorithm = consts.SERVER.CYPTO.ALGO,
    crypto_password =  consts.SERVER.CYPTO.PWD
/**
 * @description used for listing an variant product from admin panel
 * @param {Object} req 
 * @param {*Object} res 
 */
const variantList=async (req,res)=>{
    try{
        var accessToken = req.body.accessToken;
        var authSectionId = req.body.sectionId;
        var category_id=req.body.category_id,finalVariantArray=[];
        var manValues = [category_id];
        // var sql = "select cat_variants.name,cat_variants.id,CONCAT('[',GROUP_CONCAT(CONCAT('{\"name\":\"',cat_variants_ml.name,'\",\"languageId\":\"',cat_variants_ml.language_id,'\"}')),']') as names"+ 
        // " from cat_variants inner join cat_variants_ml on cat_variants_ml.cat_variant_id=cat_variants.id where cat_variants.cat_id=? and cat_variants.deleted_by=?;"; 
        var sql = "select cat_variants_ml.id as ml_id,cat_variants_ml.name,cat_variants.id,cat_variants.variant_type,cat_variants_ml.language_id from cat_variants inner join cat_variants_ml on cat_variants_ml.cat_variant_id=cat_variants.id where cat_variants.cat_id=? and cat_variants.deleted_by=? "
        let catVariants=await ExecuteQ.Query(req.dbName,sql,[parseInt(category_id),0])
        //    var st= multiConnection[req.dbName].query(sql, [parseInt(category_id),0], function (err, catVariants) {
    //     console.log(st.sql);    
    //     if (err) {
    //         logger.debug("============error some where in variant list========",st.sql,err)
    //             sendResponse.somethingWentWrongError(res);
    //         }
    //         else {
                var variant = [];
                if (variantLength == 0) {
                    sendResponse.sendSuccessData(variant, constant.responseMessage.SUCCESS, res, 200);
                }
                else{
                    // con
                    var after_group=_.groupBy(catVariants,"id"),json_variant={};
                    _.mapObject(after_group,function(val,key){
                        json_variant.id=key,
                        json_variant.name=val                       
                        finalVariantArray.push(json_variant)
                        json_variant={}
                    })            
                    // logger.debug("_==========finalvarint array======",finalVariantArray[0].name[0].variant_type)        
                    var variantLength = finalVariantArray.length;
                    // var variantID=catVariants && catVariants[0].id;
                    console.log("=finalVariantArray=",finalVariantArray);

                    var sql2 = "select value,vr.id,vr.cat_variant_id from variants vr inner join cat_variants cvt on cvt.id=vr.cat_variant_id and vr.deleted_by=?"; 
                    let variants=await ExecuteQ.Query(req.dbName,sql2,[0])
                    // multiConnection[req.dbName].query(sql2,[0],function (err, variants) {
                    //     console.log(err,variant)
                    //     if (err) {
                    //         logger.debug("========error in between in the variant list==========",err)
                    //         sendResponse.somethingWentWrongError(res);
                    //     }
                    //     else{
                            console.log(varianValueLength)
                            var varianValueLength = variants.length;                 
                            for (var i = 0; i < variantLength; i++) {
                                (function (i) {
                                    var variantData=[];

                                    if(varianValueLength==0){
                                        variant.push({
                                            "variant_name":finalVariantArray[i].name,
                                            "id":finalVariantArray[i].id,
                                            "variant_type": finalVariantArray[i].name[0].variant_type,
                                            "variant_values":[]
                                            })
                                    }

                                    else{

                                    for(var j=0;j<varianValueLength;j++){
    
                                        (function(j){
    
                                            if(finalVariantArray[i].id==variants[j].cat_variant_id){
    
                                                console.log("====",i,variantLength)
    
                                                variantData.push({
                                                        "value":variants[j].value,
                                                        "id":variants[j].id
                                                })
    
                                                if(j==varianValueLength-1){                                                
                                                    variant.push({
                                                            "variant_name":finalVariantArray[i].name,
                                                            "id":finalVariantArray[i].id,
                                                            "variant_type": finalVariantArray[i].name[0].variant_type,
                                                            "variant_values":variantData
                                                    })
                                                }
    
                                            }
                                            else{
                                                if(j==varianValueLength-1){
                                                    variant.push({
                                                            "variant_name":finalVariantArray[i].name,
                                                            "id":finalVariantArray[i].id,
                                                            "variant_type": finalVariantArray[i].name[0].variant_type,
                                                            "variant_values":variantData
                                                    })
                                                }
                                            }
    
                                        }(j))
                                    }
                                }
                                }(i))
                            
                        }
                        sendResponse.sendSuccessData(variant, constant.responseMessage.SUCCESS, res, 200);
                    // }
                    
                    // })
             
        }
    //         }
    // })
    }
    catch(err){
        console.log("===ERRR!==",err)
        sendResponse.somethingWentWrongError(res);
    }

}
module.exports={
    variantList:variantList
}