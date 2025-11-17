import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { glossaryTerms } from '@/data/glossary'
import { Search } from 'lucide-react'

export function Glossary() {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredTerms = glossaryTerms.filter(
    (term) =>
      term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      term.definition.toLowerCase().includes(searchTerm.toLowerCase()) ||
      term.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const categories = Array.from(new Set(glossaryTerms.map((t) => t.category)))

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Glossary</h1>
        <p className="text-muted-foreground">
          Essential terms and definitions for systematic reviews and meta-analysis
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search terms..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Badge key={category} variant="outline">
            {category}
          </Badge>
        ))}
      </div>

      {/* Terms */}
      <div className="grid gap-4">
        {filteredTerms.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              No terms found matching "{searchTerm}"
            </CardContent>
          </Card>
        ) : (
          filteredTerms.map((term) => (
            <Card key={term.term}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle>{term.term}</CardTitle>
                    <Badge variant="secondary">{term.category}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <CardDescription className="text-base">
                  {term.definition}
                </CardDescription>
                {term.relatedTerms && term.relatedTerms.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Related Terms:</p>
                    <div className="flex flex-wrap gap-2">
                      {term.relatedTerms.map((related) => (
                        <Badge key={related} variant="outline" className="text-xs">
                          {related}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
