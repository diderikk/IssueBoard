module Mutations
	class Delete::DeleteIssueLabel < GraphQL::Schema::Mutation
		graphql_name "DeleteIssueLabel"
		argument :issue_label_id, ID, required: true

		field :success, Boolean, null: false

		def resolve(issue_label_id:)
			if IssueLabel.destroy(issue_label_id)
				{
					success: true
				}
			else
				{
					success: false
				}
			end
		end

		private

		def authorized?(issue_label_id:)
			Types::IssueLabelType.authorized?(IssueLabel.find(issue_label_id), context)
		end

	end
end