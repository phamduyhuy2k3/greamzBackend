package com.greamz.backend.checkout.momo;

import com.fasterxml.jackson.core.JsonProcessingException;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;

@Controller
@RequestMapping("/api/v1/payment/momo")

public class MomoController { ;
    @Autowired
    private MomoService momoService;

    @PostMapping("/momo/ipn")
    public ResponseEntity<MomoResponse> ipnMomo(MomoResponse response) {
        System.out.println("IPN MOMO");
        System.out.println(response.getResultCode());
        return ResponseEntity.ok(response);
    }


    @SneakyThrows
    @GetMapping("momo-result")
    public void result(
            @RequestParam("partnerCode") String partnerCode,
            @RequestParam("orderId") String orderId,
            @RequestParam("requestId") String requestId,
            @RequestParam("amount") String amount,
            @RequestParam("orderInfo") String orderInfo,
            @RequestParam("orderType") String orderType,
            @RequestParam("transId") String transId,
            @RequestParam("resultCode") int resultCode,
            @RequestParam("message") String message,
            @RequestParam("payType") String payType,
            @RequestParam("responseTime") String responseTime,
            @RequestParam("extraData") String extraData,
            @RequestParam("signature") String signature,
            HttpServletResponse response
    ) {

        MomoResult result = new MomoResult();
        result.setPartnerCode(partnerCode);
        result.setOrderId(orderId);
        result.setRequestId(requestId);
        result.setAmount(amount);
        result.setOrderInfo(orderInfo);
        result.setOrderType(orderType);
        result.setTransId(transId);
        result.setResultCode(resultCode);
        result.setMessage(message);
        result.setPayType(payType);
        result.setResponseTime(responseTime);
        result.setExtraData(extraData);
        result.setSignature(signature);
        momoService.momoResult(result,response);



    }
}
