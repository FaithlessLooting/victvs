<?php

namespace App\Http\Controllers;

use App\Models\Candidate;

class CandidateController extends Controller
{
    // get all candidates
    public function index()
    {
        $candidates = Candidate::with('exams')->get();
        return response()->json($candidates);
    }

    // get single candiate exams
    public function show($id)
    {
        $candidate = Candidate::with('exams')->findOrFail($id);
        return response()->json($candidate);
    }
}