<?php

namespace App\Http\Controllers;

use App\Models\Exam;
use Illuminate\Http\Request;

class ExamController extends Controller
{
    // get all exams
    public function index()
    {
        $exams = Exam::with(['candidates', 'location'])->get();
        return response()->json($exams);
    }

    // get single exam
    public function show($id)
    {
        $exam = Exam::with(['candidates', 'location'])->findOrFail($id);
        return response()->json($exam);
    }

    //update from FE for status field
public function updateStatus(Request $request, $id)
{
    $request->validate([
        'status' => 'required|in:pending,started,finished',
    ]);

    // Only update status
    $exam = Exam::findOrFail($id);
    $exam->status = $request->status;
    $exam->save();

    // Return exam with relationships
    return $exam->load(['candidates', 'location']);
}
}