<?php

namespace App\Http\Controllers;

use App\Models\Location;

class LocationController extends Controller
{
    // get locations
public function index()
{
    return Location::all();
}

    // get single location
    public function show($id)
    {
        $location = Location::with('exams')->findOrFail($id);
        return response()->json($location);
    }
}