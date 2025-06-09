import React, { Dispatch, SetStateAction } from 'react'

interface NodeSelectorProps{
    selectedNode:string,
    setSelectedNode:Dispatch<SetStateAction<string>>
}

const NodeSelector = ({selectedNode,setSelectedNode}:NodeSelectorProps) => {
  return (
    <select
            id="nodeSelect"
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedNode}
            onChange={(e) => setSelectedNode(e.target.value)}
        >
           <option value="all">All Nodes</option>
            <option value="node_1">Node 1</option>
            <option value="node_2">Node 2</option>
            <option value="node_3">Node 3</option>
            <option value="node_4">Node 4</option>
            <option value="node_5">Node 5</option>
            <option value="node_6">Node 6</option>
            <option value="node_7">Node 7</option>
            <option value="node_8">Node 8</option>
            <option value="node_9">Node 9</option>

            </select>
  )
}

export default NodeSelector
