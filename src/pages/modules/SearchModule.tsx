import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { useAppStore } from '@/stores/appStore'
import { CheckCircle2, Plus, Trash2 } from 'lucide-react'

export function SearchModule() {
  const { markModuleComplete, isModuleComplete } = useAppStore()
  const isComplete = isModuleComplete('search')

  const [searchBlocks, setSearchBlocks] = useState([
    { id: 1, terms: [''], operator: 'OR' }
  ])

  const addTerm = (blockId: number) => {
    setSearchBlocks(blocks =>
      blocks.map(block =>
        block.id === blockId
          ? { ...block, terms: [...block.terms, ''] }
          : block
      )
    )
  }

  const updateTerm = (blockId: number, termIndex: number, value: string) => {
    setSearchBlocks(blocks =>
      blocks.map(block =>
        block.id === blockId
          ? {
              ...block,
              terms: block.terms.map((t, i) => i === termIndex ? value : t)
            }
          : block
      )
    )
  }

  const addBlock = () => {
    const newId = Math.max(...searchBlocks.map(b => b.id)) + 1
    setSearchBlocks([...searchBlocks, { id: newId, terms: [''], operator: 'OR' }])
  }

  const generateQuery = () => {
    return searchBlocks
      .map(block => {
        const blockQuery = block.terms
          .filter(t => t.trim())
          .map(t => `"${t}"`)
          .join(` ${block.operator} `)
        return block.terms.filter(t => t.trim()).length > 1
          ? `(${blockQuery})`
          : blockQuery
      })
      .filter(q => q)
      .join(' AND ')
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Search Strategy Development</h1>
          {isComplete && (
            <Badge variant="success" className="flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4" />
              Completed
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground">
          Build comprehensive Boolean search queries for systematic reviews
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Learning Objectives</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li>• Understand Boolean operators (AND, OR, NOT)</li>
            <li>• Build multi-concept search strategies</li>
            <li>• Use MeSH terms and keywords effectively</li>
            <li>• Balance sensitivity and specificity</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Boolean Search Composer</CardTitle>
          <CardDescription>
            Build your search strategy using multiple concept blocks
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {searchBlocks.map((block, blockIndex) => (
            <div key={block.id} className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Concept Block {blockIndex + 1}</h3>
                <Badge variant="outline">{block.operator}</Badge>
              </div>
              {block.terms.map((term, termIndex) => (
                <div key={termIndex} className="flex gap-2">
                  <Input
                    placeholder="Enter search term or MeSH heading"
                    value={term}
                    onChange={(e) => updateTerm(block.id, termIndex, e.target.value)}
                  />
                  {termIndex > 0 && termIndex === block.terms.length - 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSearchBlocks(blocks =>
                          blocks.map(b =>
                            b.id === block.id
                              ? { ...b, terms: b.terms.filter((_, i) => i !== termIndex) }
                              : b
                          )
                        )
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => addTerm(block.id)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Synonym
              </Button>
            </div>
          ))}

          <Button onClick={addBlock} variant="secondary" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Concept Block
          </Button>

          {searchBlocks.some(b => b.terms.some(t => t.trim())) && (
            <div className="p-4 bg-muted rounded-lg">
              <p className="font-semibold mb-2">Generated Search Query:</p>
              <code className="text-sm block p-3 bg-background rounded">
                {generateQuery()}
              </code>
            </div>
          )}

          {!isComplete && searchBlocks.length >= 2 && (
            <Button
              onClick={() => markModuleComplete('search')}
              className="w-full"
            >
              Mark Module as Complete
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
