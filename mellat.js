const soap = require( 'soap' );
const moment = require( 'moment' );
/**
 * Mellat gateway helper
 */
class MellatGateway {
    /**
     * Initialize the client
     */
    initClient() {
        return new Promise( ( resolve, reject ) => {
            soap.createClient( 'https://bpm.shaparak.ir/pgwchannel/services/pgw?wsdl', { 'overrideRootElement': { namespace: 'ns1' }, 'wsdl_headers': { 'namespace': 'http://interfaces.core.sw.bps.com/' } }, function( err, client ) {
                if ( err ) return reject( err );
                else return resolve( client );
            } );
        } );
    }

    /**
     * Request the payment
     */
    Request( terminal, username, password, amount, returnPage ) {
        var _self = this;
        return new Promise( ( resolve, reject ) => {
            _self.initClient().then( function( client ) {
                var nm = 'http://interfaces.core.sw.bps.com/:';
                var params = {
                    terminalId:             terminal,
                    userName:               username,
                    userPassword:           password,
                    orderId:                moment().format( 'YMMDDHHmmSS' ),
                    amount:                 amount,
                    localDate:              moment().format( 'YYMMDD' ),
                    localTime:              moment().format( 'HHmmSS' ),
                    additionalData:         '',
                    callBackUrl:            returnPage,
                    payerId:                '0'
                };
                client.bpPayRequest( params, function( err, result ) {
                    if ( err ) return reject( err );
                    
                    var res = result.return.split( ',' );
                    if ( res[0] == 0 ) {
                        return resolve( { ResCode: res[0], RefId: res[1] } );
                    } else {
                        return reject( { errorCode: res[0] } );
                    }

                }, { ignoredNamespaces: { namespaces: [], override: true } } );
            } ).catch( function( err ) {
                return reject( err );
            } );
        } );
    }

    /**
     * Verifies the payment
     */
    Verify( terminal, username, password, saleOrderId, resCode, saleRefId ) {
        var _self = this;
        return new Promise( ( resolve, reject ) => {
            _self.initClient().then( function( client ) {
                if ( resCode != 0 ) {
                    if ( resCode == 17 ) {
                        return resolve( { err: true, reason: 'cancel' } );
                    } else {
                        return resolve( { err: true, reason: resCode } );
                    }
                }

                var shouldReverse = false;
                var status = 0;

                var params = {
                    terminalId:             terminal,
                    userName:               username,
                    userPassword:           password,
                    orderId:                saleOrderId,
                    saleOrderId:            saleOrderId,
                    saleReferenceId:        saleRefId
                };
                client.bpVerifyRequest( params, function( err, result ) {
                    if ( err ) return reject( err );
                    if ( result.return == 0 ) {
                        _self.Inquiry( terminal, username, password, saleOrderId, saleRefId ).then( ( data ) => {
                            if ( data.err == false ) {
                                _self.Settle( terminal, username, password, saleOrderId, saleRefId ).then( ( data ) => {
                                    if ( data.err == false ) {
                                        return resolve( { err: false } );
                                    } else {
                                        _self.Reverse( terminal, username, password, saleOrderId, saleRefId );
                                        return resolve( { err: true, reason: data.err } );
                                    }
                                } ).catch( ( e ) => {
                                    _self.Reverse( terminal, username, password, saleOrderId, saleRefId );
                                    return reject( { err: true, reason: e } );
                                } );
                            } else {
                                _self.Reverse( terminal, username, password, saleOrderId, saleRefId );
                                return resolve( { err: true, reason: data.err } );
                            }
                        } ).catch( ( e ) => {
                            _self.Reverse( terminal, username, password, saleOrderId, saleRefId );
                            return reject( { err: true, reason: e } );
                        } );
                    } else {
                        _self.Reverse( terminal, username, password, saleOrderId, saleRefId );
                        return resolve( { err: true, reason: result.return } );
                    }
                } );
            } ).catch( function( err ) {
                _self.Reverse( terminal, username, password, saleOrderId, saleRefId );
                return reject( { err: true, reason: err } );
            } );
        } );
    }

    /**
     * Inquiry the payment
     */
    Inquiry( terminal, username, password, saleOrderId, saleRefId ) {
        var _self = this;
        return new Promise( ( resolve, reject ) => {
            _self.initClient().then( function( client ) {

                var shouldReverse = false;
                var status = 0;

                var params = {
                    terminalId:             terminal,
                    userName:               username,
                    userPassword:           password,
                    orderId:                saleOrderId,
                    saleOrderId:            saleOrderId,
                    saleReferenceId:        saleRefId
                };
                client.bpInquiryRequest( params, function( err, result ) {
                    if ( err ) return reject( err );
                    if ( result.return == 0 ) {
                        resolve( { err: false } );
                    } else {
                        return resolve( { err: true, reason: result.return } );
                    }
                } );
            } ).catch( function( err ) {
                return reject( err );
            } );
        } );
    }

    /**
     * Settle the payment
     */
    Settle( terminal, username, password, saleOrderId, saleRefId ) {
        var _self = this;
        return new Promise( ( resolve, reject ) => {
            _self.initClient().then( function( client ) {

                var shouldReverse = false;
                var status = 0;

                var params = {
                    terminalId:             terminal,
                    userName:               username,
                    userPassword:           password,
                    orderId:                saleOrderId,
                    saleOrderId:            saleOrderId,
                    saleReferenceId:        saleRefId
                };
                client.bpSettleRequest( params, function( err, result ) {
                    if ( err ) return reject( err );
                    if ( result.return == 0 ) {
                        resolve( { err: false } );
                    } else {
                        return resolve( { err: true, reason: result.return } );
                    }
                } );
            } ).catch( function( err ) {
                return reject( err );
            } );
        } );
    }

    /**
     * Reverse the payment
     */
    Reverse( terminal, username, password, saleOrderId, saleRefId ) {
        var _self = this;
        return new Promise( ( resolve, reject ) => {
            _self.initClient().then( function( client ) {

                var shouldReverse = false;
                var status = 0;

                var params = {
                    terminalId:             terminal,
                    userName:               username,
                    userPassword:           password,
                    orderId:                saleOrderId,
                    saleOrderId:            saleOrderId,
                    saleReferenceId:        saleRefId
                };
                client.bpReversalRequest( params, function( err, result ) {
                    if ( err ) return reject( err );
                    if ( result.return == 0 ) {
                        resolve( { err: false } );
                    } else {
                        return resolve( { err: true, reason: result.return } );
                    }
                } );
            } ).catch( function( err ) {
                return reject( err );
            } );
        } );
    }
}
module.exports = new MellatGateway();