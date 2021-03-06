#include "../ccv.h"

/*************************************************************
 * C-based/Cached/Core Computer Vision Library with CUDA (CWC)
 * Liu Liu, 2013-12-01
 *************************************************************/

#ifndef GUARD_cwc_h
#define GUARD_cwc_h

void cwc_convnet_encode(ccv_convnet_t* convnet, ccv_dense_matrix_t** a, ccv_dense_matrix_t** b, int batch);
void cwc_convnet_classify(ccv_convnet_t* convnet, ccv_dense_matrix_t** a, int* labels, int batch);
void cwc_convnet_supervised_train(ccv_convnet_t* convnet, ccv_array_t* categorizeds, ccv_array_t* tests, ccv_convnet_train_param_t params);
void cwc_convnet_compact(ccv_convnet_t* convnet);

#endif
