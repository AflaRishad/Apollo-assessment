<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function index(Request $request)
    {
        return $request->user()->projects()->with('tasks')->latest()->get();
    }
    
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $project = $request->user()->projects()->create($data);

        return response()->json($project, 201);
    }

    
    public function show(Request $request, Project $project)
    {
        abort_if($project->user_id !== $request->user()->id, 403);

        $project->load('tasks');

        return response()->json($project);
    }
}
