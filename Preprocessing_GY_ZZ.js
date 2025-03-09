#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Sat Mar  8 11:29:28 2025

@author: zhangzirui
"""

/*     
    Modified from GSG part 1
    Written to create and pre-process FMRs

Creates and pre-processes FMR files:
Slice Time Correction.
Motion Correction, aligning to specific volume of first entry in fmrprojectnames.
GLM Temporal Filter with 7 cycles

*/


var File =  "G:/2024WMPFC_test/Preprocessing/JK25_7T_027/";
var Subject = "027";
var series = ["11","12","13","14","15","16","17","18","19","20"];

var RUNN = ["Run1","Run2","Run3","Run4","Run5","Run6","Run7","Run8","Run9","Run10"];

var fmrprojectnames = [
"11_JK25_7T_" + Subject + "_Run1",
"12_JK25_7T_" + Subject + "_Run2",
"13_JK25_7T_" + Subject + "_Run3",
"14_JK25_7T_" + Subject + "_Run4",
"15_JK25_7T_" + Subject + "_Run5",
"16_JK25_7T_" + Subject + "_Run6",
"17_JK25_7T_" + Subject + "_Run7",
"18_JK25_7T_" + Subject + "_Run8",
"19_JK25_7T_" + Subject + "_Run9",
"20_JK25_7T_" + Subject + "_Run10"];

var projectnr; // this is the counter

for (projectnr = 0; projectnr < fmrprojectnames.length; projectnr++){

FilePath = File + series[projectnr] + "_JK25_7T_" + Subject + "_" + RUNN[projectnr] + "/";
FilePath_run1 = File + "11_JK25_7T_" + Subject + "_Run1/";

BrainVoyager.PrintToLog("Step: Preprocessing of FMR projects");

FMR = BrainVoyager.OpenDocument( FilePath + fmrprojectnames[projectnr] + ".fmr" );

// <<<< Slice Scan Time Correction >>>>

var InterpolationMethod = 1; //0 = trilinear, 1 = cubic spline, 2 = windowed SINC.

FMR.CorrectSliceTimingUsingTimeTable(InterpolationMethod);

var ResultFileName = FMR.FileNameOfPreprocessdFMR;
FMR.Close(); //FMR.Remove();
FMR = BrainVoyager.OpenDocument( ResultFileName );

// <<<< Motion correction >>>>
var TargetRun = FilePath_run1 + "11_JK25_7T_" + Subject + "_Run1" + ".fmr";
var TargetVolume = 1;
var InterpolationMethod = 2; //0 and 1 = trilinear, 2 = tri-linear detection and sinc apply, 3 = sinc.
var UseFullData = true;
var NrIterations = 100;
var CreateMovie = true;
var GenerateExtendedLogFile = false;
FMR.CorrectMotionTargetVolumeInOtherRunEx(TargetRun,TargetVolume, InterpolationMethod, UseFullData, NrIterations, CreateMovie, GenerateExtendedLogFile);

var ResultFileName = FMR.FileNameOfPreprocessdFMR;
FMR.Close();
FMR = BrainVoyager.OpenDocument( ResultFileName );

// <<<< Temporal Filtering >>>>
var FilterValue = [2,2,2,2,2,2,2,2,2,2];//
FMR.TemporalHighPassFilterGLMFourier( FilterValue[projectnr]);

var ResultFileName = FMR.FileNameOfPreprocessdFMR;
FMR.Close();
FMR = BrainVoyager.OpenDocument( ResultFileName );
FMR.Close();

}